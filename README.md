Gemmy (字字珠玑)
===============

One line brilliant words, e.g. mottos, little skills.

随机获取一行牛逼的话，箴言、小技巧等，展示在你的博客顶部。基于索引文件机制设计成可以部署到 GitHub Pages 的“伪”服务。
[Demo 用例](https://wonderbeyond.github.io/gemmy/gemmy-app/index.html)

---

## 术语

- GEM：特指单个词条
- GEM ID：GEM 的序号（按存放顺序，从 1 开始）

## 索引设计

*顶层索引* `gemmy-index.yaml` 示例：

```yaml
total_count: 32
pagination:
  size: 10
exclude: [3]
tags: [motto, life, coding, shell, linux]
```

- `total_count` 表示 GEM 总数量
- `pagination.size` 表示数据分块大小
- `tags` 列出所有的 tag 名字

*tags 索引* `{tag-name}.json`，比如 `motto.json`:

```json
[1, 22, 28]
```

里面包含一个 tag 对应的所有 GEM ID.

### 客户端如何随机获取一条 GEM

首先获取顶层索引，生成一个范围在 1 到 `total_count` 之间的随机整数，然后根据 `pagination.size` (以 10 为例) 计算出目标 GEM 所在的分块序号，比如 `GEM#55` 应该放在第 6 分块中的第 5 行，然后生成 URL 下载数据块，取出对应行。

### 如何随机获取指定 tag 下的 GEM

获取对应 tag 的索引文件，随机挑选一条，然后参考上面的方法，根据 GEM ID 获取 GEM 词条。

## GEM 数据管理

脚本 `gemman.js` 提供了常规的管理命令，功能包括：

- 导出所有 GEM 到单个文件
- 批量添加 GEM

```javascript
node gemman.js --help
```
