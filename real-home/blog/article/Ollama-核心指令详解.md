# 核心指令详解

## 1. 模型管理指令

获取模型列表：
```bash
ollama list
```

拉取新模型：

```bash
ollama pull llama2
ollama pull mistral
ollama pull codellama
```

删除模型：
```bash
ollama rm modelname
```

## 2. 运行与交互指令

启动模型对话：
```bash
ollama run llama2
```

使用特定参数运行模型：
```bash
ollama run llama2 "Write a story about a space adventure" --temperature 0.7
```

## 3. 创建自定义模型

创建Modelfile：
```plaintext
FROM llama2
SYSTEM "You are a helpful AI assistant focused on programming."
PARAMETER temperature 0.7
```

构建自定义模型：
```bash
ollama create custom-assistant -f Modelfile
```

## 4. 高级参数控制

设置上下文长度：
```bash
ollama run llama2 --context-length 4096
```

调整生成参数：
```bash
ollama run llama2 --temperature 0.7 --top-p 0.9
```
