#!/bin/bash

# 北魏历史数据库 Docker 管理脚本

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 函数：打印彩色消息
print_message() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo -e "${BLUE}================================${NC}"
    echo -e "${BLUE} 北魏历史数据库 Docker 管理${NC}"
    echo -e "${BLUE}================================${NC}"
}

# 检查Docker是否安装
check_docker() {
    if ! command -v docker &> /dev/null; then
        print_error "Docker 未安装，请先安装 Docker"
        exit 1
    fi
    
    if ! command -v docker compose &> /dev/null; then
        print_error "Docker Compose 未安装，请先安装 Docker Compose"
        exit 1
    fi
}

# 检查环境文件
check_env_file() {
    if [ ! -f ".env" ]; then
        if [ -f "env.example" ]; then
            print_warning ".env 文件不存在，从 env.example 复制..."
            cp env.example .env
            print_message "请编辑 .env 文件设置数据库密码等配置"
        else
            print_error "环境配置文件不存在，请创建 .env 文件"
            exit 1
        fi
    fi
}

# 启动数据库
start_db() {
    print_header
    print_message "启动北魏历史数据库..."
    
    check_docker
    check_env_file
    
    # 启动服务
    docker compose up -d db
    
    print_message "等待数据库启动..."
    sleep 10
    
    # 检查数据库健康状态
    if docker compose ps db | grep -q "healthy"; then
        print_message "✅ 数据库启动成功！"
        print_connection_info
    else
        print_warning "数据库可能还在启动中，请稍等片刻..."
        print_message "使用 'docker-compose logs db' 查看启动日志"
    fi
}

# 启动完整服务（包括pgAdmin）
start_all() {
    print_header
    print_message "启动完整服务（数据库 + pgAdmin）..."
    
    check_docker
    check_env_file
    
    docker compose up -d
    
    print_message "等待服务启动..."
    sleep 15
    
    print_connection_info
    print_pgadmin_info
}

# 停止服务
stop_services() {
    print_header
    print_message "停止所有服务..."
    
    docker compose down
    print_message "✅ 服务已停止"
}

# 重启服务
restart_services() {
    print_header
    print_message "重启服务..."
    
    docker compose restart
    print_message "✅ 服务已重启"
}

# 查看日志
show_logs() {
    print_header
    print_message "显示数据库日志..."
    
    docker compose logs -f db
}

# 进入数据库命令行
connect_db() {
    print_header
    print_message "连接到数据库..."
    
    # 从环境文件读取配置
    source .env 2>/dev/null || true
    
    DB_USER=${POSTGRES_USER:-beiwei_user}
    DB_NAME=${POSTGRES_DB:-beiwei_history}
    
    docker compose exec db psql -U "$DB_USER" -d "$DB_NAME"
}

# 备份数据库
backup_db() {
    print_header
    print_message "备份数据库..."
    
    # 从环境文件读取配置
    source .env 2>/dev/null || true
    
    DB_USER=${POSTGRES_USER:-beiwei_user}
    DB_NAME=${POSTGRES_DB:-beiwei_history}
    
    # 创建备份目录
    mkdir -p backups
    
    # 生成备份文件名
    BACKUP_FILE="backups/beiwei_history_$(date +%Y%m%d_%H%M%S).sql"
    
    # 执行备份
    docker compose exec -T db pg_dump -U "$DB_USER" -d "$DB_NAME" > "$BACKUP_FILE"
    
    print_message "✅ 数据库已备份到: $BACKUP_FILE"
}

# 恢复数据库
restore_db() {
    if [ -z "$1" ]; then
        print_error "请指定备份文件路径"
        print_message "用法: $0 restore <backup_file>"
        exit 1
    fi
    
    if [ ! -f "$1" ]; then
        print_error "备份文件不存在: $1"
        exit 1
    fi
    
    print_header
    print_warning "⚠️  这将覆盖现有数据库内容！"
    read -p "确认恢复数据库？(y/N): " -n 1 -r
    echo
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        # 从环境文件读取配置
        source .env 2>/dev/null || true
        
        DB_USER=${POSTGRES_USER:-beiwei_user}
        DB_NAME=${POSTGRES_DB:-beiwei_history}
        
        print_message "恢复数据库从: $1"
        docker compose exec -T db psql -U "$DB_USER" -d "$DB_NAME" < "$1"
        
        print_message "✅ 数据库恢复完成"
    else
        print_message "操作已取消"
    fi
}

# 重置数据库
reset_db() {
    print_header
    print_warning "⚠️  这将删除所有数据并重新初始化数据库！"
    read -p "确认重置数据库？(y/N): " -n 1 -r
    echo
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        print_message "停止服务..."
        docker compose down
        
        print_message "删除数据卷..."
        docker volume rm $(docker compose config --volumes) 2>/dev/null || true
        
        print_message "重新启动服务..."
        docker compose up -d db
        
        print_message "✅ 数据库已重置"
        print_connection_info
    else
        print_message "操作已取消"
    fi
}

# 显示连接信息
print_connection_info() {
    source .env 2>/dev/null || true
    
    DB_USER=${POSTGRES_USER:-beiwei_user}
    DB_NAME=${POSTGRES_DB:-beiwei_history}
    DB_PORT=${POSTGRES_PORT:-5432}
    
    echo
    print_message "📊 数据库连接信息："
    echo "  主机: localhost"
    echo "  端口: $DB_PORT"
    echo "  数据库: $DB_NAME"
    echo "  用户: $DB_USER"
    echo "  连接URL: postgresql://$DB_USER:****@localhost:$DB_PORT/$DB_NAME"
    echo
}

# 显示pgAdmin信息
print_pgadmin_info() {
    source .env 2>/dev/null || true
    
    PGADMIN_PORT=${PGADMIN_PORT:-8080}
    PGADMIN_EMAIL=${PGADMIN_EMAIL:-admin@beiwei.com}
    
    echo
    print_message "🌐 pgAdmin 管理界面："
    echo "  URL: http://localhost:$PGADMIN_PORT"
    echo "  邮箱: $PGADMIN_EMAIL"
    echo "  密码: (见 .env 文件中的 PGADMIN_PASSWORD)"
    echo
}

# 显示帮助信息
show_help() {
    print_header
    echo "用法: $0 <command>"
    echo
    echo "可用命令:"
    echo "  start      - 启动数据库服务"
    echo "  start-all  - 启动完整服务（数据库 + pgAdmin）"
    echo "  stop       - 停止所有服务"
    echo "  restart    - 重启服务"
    echo "  logs       - 查看数据库日志"
    echo "  connect    - 连接到数据库命令行"
    echo "  backup     - 备份数据库"
    echo "  restore    - 恢复数据库 (需要指定备份文件)"
    echo "  reset      - 重置数据库（删除所有数据）"
    echo "  status     - 查看服务状态"
    echo "  help       - 显示此帮助信息"
    echo
    echo "示例:"
    echo "  $0 start"
    echo "  $0 backup"
    echo "  $0 restore backups/beiwei_history_20231201_120000.sql"
    echo
}

# 查看服务状态
show_status() {
    print_header
    print_message "服务状态："
    docker compose ps
    echo
    
    if docker compose ps | grep -q "Up"; then
        print_connection_info
        
        if docker compose ps | grep -q "pgadmin.*Up"; then
            print_pgadmin_info
        fi
    fi
}

# 主函数
main() {
    case "${1:-help}" in
        "start")
            start_db
            ;;
        "start-all")
            start_all
            ;;
        "stop")
            stop_services
            ;;
        "restart")
            restart_services
            ;;
        "logs")
            show_logs
            ;;
        "connect")
            connect_db
            ;;
        "backup")
            backup_db
            ;;
        "restore")
            restore_db "$2"
            ;;
        "reset")
            reset_db
            ;;
        "status")
            show_status
            ;;
        "help"|*)
            show_help
            ;;
    esac
}

# 执行主函数
main "$@"