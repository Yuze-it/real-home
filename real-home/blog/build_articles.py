import os
import json
from datetime import datetime

ARTICLE_DIR = os.path.join(os.path.dirname(__file__), 'article')
OUTPUT_JSON = os.path.join(os.path.dirname(__file__), 'articles.json')

def extract_date_from_content(filepath):
    # 尝试从文件内容前几行提取日期
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            for _ in range(10):  # 只检查前10行
                line = f.readline()
                if not line:
                    break
                # 支持如 date: 2025-03-11 或 日期: 2025-03-11
                if 'date:' in line or '日期:' in line:
                    for prefix in ['date:', '日期:']:
                        if prefix in line:
                            date_str = line.split(prefix)[-1].strip()
                            try:
                                return datetime.strptime(date_str[:10], '%Y-%m-%d')
                            except Exception:
                                continue
    except Exception:
        pass
    return None

def build_article_list(order='desc'):
    articles = []
    for fname in os.listdir(ARTICLE_DIR):
        if fname.endswith('.md'):
            filepath = os.path.join(ARTICLE_DIR, fname)
            # 优先从内容提取日期，否则用文件修改时间
            date = extract_date_from_content(filepath)
            if not date:
                ts = os.path.getmtime(filepath)
                date = datetime.fromtimestamp(ts)
            title = fname[:-3]  # 去掉 .md
            articles.append({
                'filename': fname,
                'title': title,
                'date': date.strftime('%Y-%m-%d') if date else '',
                'timestamp': date.timestamp() if date else 0
            })
    articles.sort(key=lambda x: x['timestamp'], reverse=(order=='desc'))
    with open(OUTPUT_JSON, 'w', encoding='utf-8') as f:
        json.dump(articles, f, ensure_ascii=False, indent=2)

if __name__ == '__main__':
    # 可通过命令行参数选择排序方式
    import sys
    order = 'desc'
    if len(sys.argv) > 1 and sys.argv[1] in ['asc', 'desc']:
        order = sys.argv[1]
    build_article_list(order)
    print(f'文章列表已生成到 {OUTPUT_JSON}，排序方式：{order}')
