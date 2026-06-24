const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const USER_ID = "diyaaggarwal_28062005";        
const EMAIL_ID = "diya1194.be23@chitkarauniversity.edu.in";
const COLLEGE_ROLL_NUMBER = "2311981194";


const VALID_EDGE_RE = /^[A-Z]->[A-Z]$/;

function parseInput(data) {
  const invalid_entries = [];
  const duplicate_edges = [];
  const seen = new Set();
  const valid = [];

  for (let raw of data) {
    const entry = String(raw).trim();

    if (!VALID_EDGE_RE.test(entry)) {
      invalid_entries.push(raw); 
      continue;
    }

    const [parent, child] = entry.split("->"); 
    if (parent === child) {
      // Self-loop → invalid
      invalid_entries.push(raw);
      continue;
    }

    if (seen.has(entry)) {
  
      if (!duplicate_edges.includes(entry)) duplicate_edges.push(entry);
    } else {
      seen.add(entry);
      valid.push({ parent, child });
    }
  }

  return { valid, invalid_entries, duplicate_edges };
}

function buildHierarchies(valid) {
  const children = {};  
  const parentOf = {};   
  const allNodes = new Set();

  for (const { parent, child } of valid) {
    allNodes.add(parent);
    allNodes.add(child);

    if (!children[parent]) children[parent] = [];

    if (parentOf[child] !== undefined) continue;

    parentOf[child] = parent;
    children[parent].push(child);
  }

  const visited = new Set();

  function component(start) {
    const stack = [start];
    const nodes = new Set();
    while (stack.length) {
      const n = stack.pop();
      if (nodes.has(n)) continue;
      nodes.add(n);
      (children[n] || []).forEach((c) => stack.push(c));
      const p = parentOf[n];
      if (p) stack.push(p);
    }
    return nodes;
  }

  const groups = [];
  for (const node of allNodes) {
    if (!visited.has(node)) {
      const comp = component(node);
      comp.forEach((n) => visited.add(n));
      groups.push(comp);
    }
  }

  const hierarchies = [];

  for (const group of groups) {
    const roots = [...group].filter((n) => parentOf[n] === undefined);

    function hasCycle(startNodes) {
      const recStack = new Set();
      const done = new Set();

      function dfs(n) {
        if (recStack.has(n)) return true; 
        if (done.has(n)) return false;
        recStack.add(n);
        for (const c of children[n] || []) {
          if (dfs(c)) return true;
        }
        recStack.delete(n);
        done.add(n);
        return false;
      }

      for (const r of startNodes) {
        if (dfs(r)) return true;
      }
      return false;
    }

    const groupChildren = {};
    for (const n of group) groupChildren[n] = children[n] || [];

    const cycleExists = hasCycle(roots.length ? roots : [...group]);

    if (cycleExists) {
      const root =
        roots.length > 0
          ? roots.sort()[0]
          : [...group].sort()[0];
      hierarchies.push({ root, tree: {}, has_cycle: true });
      continue;
    }

    roots.sort();

    for (const root of roots) {
      // Build nested tree object
      function buildTree(node) {
        const obj = {};
        for (const child of (children[node] || []).sort()) {
          obj[child] = buildTree(child);
        }
        return obj;
      }

      const innerTree = buildTree(root);
      const tree = { [root]: innerTree };

      function depth(node) {
        const kids = children[node] || [];
        if (!kids.length) return 1;
        return 1 + Math.max(...kids.map(depth));
      }

      hierarchies.push({ root, tree, depth: depth(root) });
    }
  }

  return hierarchies;
}

function buildSummary(hierarchies) {
  const trees = hierarchies.filter((h) => !h.has_cycle);
  const cycles = hierarchies.filter((h) => h.has_cycle);

  let largest = null;
  for (const t of trees) {
    if (
      !largest ||
      t.depth > largest.depth ||
      (t.depth === largest.depth && t.root < largest.root)
    ) {
      largest = t;
    }
  }

  return {
    total_trees: trees.length,
    total_cycles: cycles.length,
    largest_tree_root: largest ? largest.root : null,
  };
}

app.post("/bfhl", (req, res) => {
  try {
    const { data } = req.body;

    if (!Array.isArray(data)) {
      return res.status(400).json({ error: '"data" must be an array' });
    }

    const { valid, invalid_entries, duplicate_edges } = parseInput(data);
    const hierarchies = buildHierarchies(valid);
    const summary = buildSummary(hierarchies);

    return res.json({
      user_id: USER_ID,
      email_id: EMAIL_ID,
      college_roll_number: COLLEGE_ROLL_NUMBER,
      hierarchies,
      invalid_entries,
      duplicate_edges,
      summary,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/", (_, res) => res.send("BFHL API is running"));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));