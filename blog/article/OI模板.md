# OI模板

## 线段树

### 建树（Build）

```c++
void up(int id) { sp[id] = sp[id * 2] + sp[id * 2 + 1]; }

void build(int id, int l, int r) {
    if (l == r) {
        sp[id] = a[l];
        return;
    }
    int mid = (l + r) / 2;
    build(id * 2, l, mid);
    build(id * 2 + 1, mid + 1, r);
    up(id);
}
```

### 单点修改（Update）

```c++
void update(int id, int l, int r, int x, int v) {
    if (l == r) {
        sp[id] += v;
        return;
    }
    int mid = (l + r) / 2;
    if (x <= mid)
        update(id * 2, l, mid, x, v);
    else
        update(id * 2 + 1, mid + 1, r, x, v);
    up(id);
}
```

### 区间查询（Query）

```c++
int query(int id, int l, int r, int ql, int qr) {
    if (ql <= l && r <= qr) return sp[id];
    int mid = (l + r) / 2, ans = 0;
    if (ql <= mid) ans += query(id * 2, l, mid, ql, qr);
    if (qr > mid) ans += query(id * 2 + 1, mid + 1, r, ql, qr);
    return ans;
}
```

### 可维护信息

- 和、积、k 次方和
- 最大值 / 最小值及其位置
- GCD / LCM、最大子段和等

## 区间修改线段树

给定数列 `a[1..n]`，进行 `q` 个操作：

1. 区间加：`1 l r x`，将 `a[l..r]` 每个元素加 `x`
2. 区间查询：`2 l r`，查询 `a[l..r]` 的和

### 单点修改线段树的局限性

- 区间修改复杂度：`O(n log n)`（需要单点修改每个元素）
- 总复杂度：`O(m·n log n)`（无法处理 1e5 级别数据）

### 优化方案：懒惰标记（Lazy Tag）

**核心思想**：

- 当修改完全覆盖节点区间时，打标记并直接更新当前节点信息，不递归子节点
- 标记在后续操作需要访问子节点时下放（pushdown）

### 代码实现

```cpp
// 标记下放
void down(int id, int l, int r) {
    if (add[id]) {
        add[id * 2] += add[id];
        add[id * 2 + 1] += add[id];
        int mid = (l + r) / 2;
        sum[id * 2] += add[id] * (mid - l + 1);
        sum[id * 2 + 1] += add[id] * (r - mid);
        add[id] = 0;
    }
}

// 区间修改
void update(int id, int l, int r, int x, int y, int v) {
    if (x <= l && r <= y) {
        sum[id] += (r - l + 1) * v;
        add[id] += v;
        return;
    }
    down(id, l, r);
    int mid = (l + r) / 2;
    if (x <= mid) update(id * 2, l, mid, x, y, v);
    if (y > mid) update(id * 2 + 1, mid + 1, r, x, y, v);
    sum[id] = sum[id * 2] + sum[id * 2 + 1]; // pushup
}

// 区间查询
LL query(int id, int l, int r, int x, int y) {
    if (x <= l && r <= y) return sum[id];
    down(id, l, r);
    int mid = (l + r) / 2;
    LL ans = 0;
    if (x <= mid) ans += query(id * 2, l, mid, x, y);
    if (y > mid) ans += query(id * 2 + 1, mid + 1, r, x, y);
    return ans;
}
```

## 树状数组

### 核心概念

- `lowbit(x)`：x 二进制最低位的 1 及后面的 0 组成的数
  计算：`lowbit(x) = x & (-x)`
- `c[i]` 管理区间：`(i - lowbit(i), i]`

### 核心操作

#### 单点修改（Add）

```c++
void add(int x, int v) {
    for (int i = x; i < maxn; i += i & -i)
        c[i] += v;
}
```

#### 前缀查询（Query）

```c++
LL qry(int x) {
    LL ret = 0;
    for (int i = x; i; i -= i & -i)
        ret += c[i];
    return ret;
}
```

#### 区间查询

```c++
LL qry(int l, int r) {
    return qry(r) - qry(l - 1);
}
```

# 树

## DFS 遍历

```cpp
void dfs(int u, int fa) {
    Fa[u] = fa;
    siz[u] = 1;
    sum[u] = a[u];
    for (auto v : G[u]) {
        if (v == fa) continue;
        dep[v] = dep[u] + 1;
        dfs(v, u);
        siz[u] += siz[v];
        sum[u] += sum[v];
    }
}

// 调用
dfs(1, -1);
```

## 相关概念

- `dep[u]`：节点 u 的深度
- `siz[u]`：u 的子树大小
- `a[u]`，`sum[u]`：u 的子树中点权之和
- `dis[u]`：点到根的路径上点权 / 边权之和
- 路径：最长路径等
- 树 + DFS 序 → 序列（可用线段树处理）

## LCA（最近公共祖先）

### 方法一：直接跳父节点

```cpp
int lca(int u, int v) {
    while (u != v) {
        if (dep[u] < dep[v]) swap(u, v);
        u = Fa[u];
    }
    return u;
}
```

### 方法二：倍增法

```cpp
// 预处理：dep[u], fa[u][i]（u 往上跳 2^i 步的位置，超过根记为 -1），ma[u][i]（路径上的最大值）

int lca(int u, int v) {
    if (dep[u] < dep[v]) swap(u, v);
    for (int i = 20; i >= 0; i--) {
        if (fa[u][i] != -1 && dep[fa[u][i]] >= dep[v])
            u = fa[u][i];
    }
    if (u == v) return u;
    for (int i = 20; i >= 0; i--) {
        if (fa[u][i] != fa[v][i]) {
            u = fa[u][i];
            v = fa[v][i];
        }
    }
    return fa[u][0];
}

// 倍增数组递推：fa[u][i] = fa[fa[u][i - 1]][i - 1]
```

## 路径长度计算

- 边权：`dis(u, v) = dis[u] + dis[v] - 2 * dis[lca(u, v)]`
- 点权：`dis(u, v) = dis[u] + dis[v] - dis[lca(u, v)] - dis[fa[lca(u, v)]]`

## 树上差分

- 求子树和之前的单点加，相当于求子树和之和的节点到根的路径加

## 次小生成树

- 求两点间路径上的最大边权

- 方法：
  1. 求最小生成树（Kruskal）得到 `sum`
  
  2. 对于不在最小生成树中的边 `(u, v, w)`，计算最小生成树上 `(u, v)` 路径上的最大值 `mw`
  
  3. 更新答案：`ans = min(ans, sum - mw + w)`
  
     - 注意：可能需要维护最大值和严格次大值，避免替换边与最大值相同的情况
  

# RMQ

## 问题引入

给定一个静态的数组 A，长度为 n，接下来会有 m 次查询，每次查询给出一个区间 `[l, r]`，要求你快速地回答出这个区间内的最小值（或最大值）是多少。

我们可以通过两层循环来完成整个预处理。外层循环 i 从 1 到 log n，内层循环 j 从 1 到 n。

```cpp
void init() {
    for (int i = 2; i <= n; i++) lg[i] = lg[i / 2] + 1;
    for (int i = 1; i <= n; i++) st[i][0] = a[i];
    for (int j = 1; j <= logn; j++) {
        for (int i = 1; i <= n; i++) {
            if (i + (1 << j) - 1 > n) break;
            st[i][j] = max(st[i][j - 1], st[i + (1 << j - 1)][j - 1]);
        }
    }
}
```

```cpp
int rmq(int l, int r) {
    int k = lg[r - l + 1];
    return max(st[l][k], st[r - (1 << k) + 1][k]);
}
```

## 使用 ST 表求解 LCA

## 欧拉序 (Euler Tour)

定义：对一棵树进行深度优先搜索 (DFS)，在进入一个节点和离开（回溯）一个节点时，都将该节点记录到一个序列中。这个序列就称为树的欧拉序。

- 例如，对于一棵简单的树 1-2-3，它的欧拉序可以是 1, 2, 1, 3, 1。
- 欧拉序的长度是 2n - 1。

关键性质：对于任意两个节点 u 和 v，它们在欧拉序中第一次出现的位置之间的那段子序列，一定包含了它们的 LCA，并且，LCA 就是这段子序列中深度最小的那个节点。

```cpp
void init() {
    for (int i = 2; i <= n; i++) lg[i] = lg[i / 2] + 1;
    for (int i = 1; i <= n; i++) st[i][0] = dep[i];
    for (int j = 1; j <= logn; j++) {
        for (int i = 1; i <= 2 * n - 1; i++) {
            if (i + (1 << j) - 1 > 2 * n - 1) break;
            st[i][j] = min(st[i][j - 1], st[i + (1 << j - 1)][j - 1]);
        }
    }
}

int lca(int u, int v) {
    if (dep[u] > dep[v]) swap(u, v);
    int diff = dep[v] - dep[u];
    for (int j = 0; j < logn; j++) {
        if ((1 << j) & diff) v = st[v][j];
    }
    if (u == v) return u;
    for (int j = logn - 1; j >= 0; j--) {
        if (st[u][j] != st[v][j]) {
            u = st[u][j], v = st[v][j];
        }
    }
    return st[u][0];
}
```

## 复杂度分析与对比

| 方法           | 预处理复杂度 | 单次查询复杂度 | 空间复杂度 | 实现难度 |
| -------------- | ------------ | -------------- | ---------- | -------- |
| 倍增法         | O(n log n)   | O(log n)       | O(n log n) | 较低     |
| 欧拉序 + ST 表 | O(n log n)   | O(1)           | O(n log n) | 较高     |

# Trie 树（字典树）

### 代码实现（小写字母）

```cpp
int ch[maxn][26];  // 子节点数组
int count[maxn];   // 节点计数
int cnt = 1;       // 节点计数器

void insert(const string &s) {
    int u = 1;
    for (int i = 0; i < s.size(); i++) {
        if (!ch[u][s[i] - 'a']) {
            ch[u][s[i] - 'a'] = ++cnt;
        }
        u = ch[u][s[i] - 'a'];
    }
    count[u]++;
}

bool query(const string &s) {
    int u = 1;
    for (int i = 0; i < s.size(); i++) {
        if (!ch[u][s[i] - 'a']) return false;
        u = ch[u][s[i] - 'a'];
    }
    return count[u];
}
```

