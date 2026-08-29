#!/usr/bin/env node
import{createRequire as __cr}from'module';const require=__cr(import.meta.url);
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __commonJS = (cb, mod) => function __require2() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// ../../node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/nodes/identity.js
var require_identity = __commonJS({
  "../../node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/nodes/identity.js"(exports) {
    "use strict";
    var ALIAS = Symbol.for("yaml.alias");
    var DOC = Symbol.for("yaml.document");
    var MAP = Symbol.for("yaml.map");
    var PAIR = Symbol.for("yaml.pair");
    var SCALAR = Symbol.for("yaml.scalar");
    var SEQ = Symbol.for("yaml.seq");
    var NODE_TYPE = Symbol.for("yaml.node.type");
    var isAlias = (node) => !!node && typeof node === "object" && node[NODE_TYPE] === ALIAS;
    var isDocument = (node) => !!node && typeof node === "object" && node[NODE_TYPE] === DOC;
    var isMap = (node) => !!node && typeof node === "object" && node[NODE_TYPE] === MAP;
    var isPair = (node) => !!node && typeof node === "object" && node[NODE_TYPE] === PAIR;
    var isScalar = (node) => !!node && typeof node === "object" && node[NODE_TYPE] === SCALAR;
    var isSeq = (node) => !!node && typeof node === "object" && node[NODE_TYPE] === SEQ;
    function isCollection(node) {
      if (node && typeof node === "object")
        switch (node[NODE_TYPE]) {
          case MAP:
          case SEQ:
            return true;
        }
      return false;
    }
    function isNode(node) {
      if (node && typeof node === "object")
        switch (node[NODE_TYPE]) {
          case ALIAS:
          case MAP:
          case SCALAR:
          case SEQ:
            return true;
        }
      return false;
    }
    var hasAnchor = (node) => (isScalar(node) || isCollection(node)) && !!node.anchor;
    exports.ALIAS = ALIAS;
    exports.DOC = DOC;
    exports.MAP = MAP;
    exports.NODE_TYPE = NODE_TYPE;
    exports.PAIR = PAIR;
    exports.SCALAR = SCALAR;
    exports.SEQ = SEQ;
    exports.hasAnchor = hasAnchor;
    exports.isAlias = isAlias;
    exports.isCollection = isCollection;
    exports.isDocument = isDocument;
    exports.isMap = isMap;
    exports.isNode = isNode;
    exports.isPair = isPair;
    exports.isScalar = isScalar;
    exports.isSeq = isSeq;
  }
});

// ../../node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/visit.js
var require_visit = __commonJS({
  "../../node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/visit.js"(exports) {
    "use strict";
    var identity = require_identity();
    var BREAK = Symbol("break visit");
    var SKIP2 = Symbol("skip children");
    var REMOVE = Symbol("remove node");
    function visit(node, visitor) {
      const visitor_ = initVisitor(visitor);
      if (identity.isDocument(node)) {
        const cd = visit_(null, node.contents, visitor_, Object.freeze([node]));
        if (cd === REMOVE)
          node.contents = null;
      } else
        visit_(null, node, visitor_, Object.freeze([]));
    }
    visit.BREAK = BREAK;
    visit.SKIP = SKIP2;
    visit.REMOVE = REMOVE;
    function visit_(key, node, visitor, path) {
      const ctrl = callVisitor(key, node, visitor, path);
      if (identity.isNode(ctrl) || identity.isPair(ctrl)) {
        replaceNode(key, path, ctrl);
        return visit_(key, ctrl, visitor, path);
      }
      if (typeof ctrl !== "symbol") {
        if (identity.isCollection(node)) {
          path = Object.freeze(path.concat(node));
          for (let i = 0; i < node.items.length; ++i) {
            const ci = visit_(i, node.items[i], visitor, path);
            if (typeof ci === "number")
              i = ci - 1;
            else if (ci === BREAK)
              return BREAK;
            else if (ci === REMOVE) {
              node.items.splice(i, 1);
              i -= 1;
            }
          }
        } else if (identity.isPair(node)) {
          path = Object.freeze(path.concat(node));
          const ck = visit_("key", node.key, visitor, path);
          if (ck === BREAK)
            return BREAK;
          else if (ck === REMOVE)
            node.key = null;
          const cv = visit_("value", node.value, visitor, path);
          if (cv === BREAK)
            return BREAK;
          else if (cv === REMOVE)
            node.value = null;
        }
      }
      return ctrl;
    }
    async function visitAsync(node, visitor) {
      const visitor_ = initVisitor(visitor);
      if (identity.isDocument(node)) {
        const cd = await visitAsync_(null, node.contents, visitor_, Object.freeze([node]));
        if (cd === REMOVE)
          node.contents = null;
      } else
        await visitAsync_(null, node, visitor_, Object.freeze([]));
    }
    visitAsync.BREAK = BREAK;
    visitAsync.SKIP = SKIP2;
    visitAsync.REMOVE = REMOVE;
    async function visitAsync_(key, node, visitor, path) {
      const ctrl = await callVisitor(key, node, visitor, path);
      if (identity.isNode(ctrl) || identity.isPair(ctrl)) {
        replaceNode(key, path, ctrl);
        return visitAsync_(key, ctrl, visitor, path);
      }
      if (typeof ctrl !== "symbol") {
        if (identity.isCollection(node)) {
          path = Object.freeze(path.concat(node));
          for (let i = 0; i < node.items.length; ++i) {
            const ci = await visitAsync_(i, node.items[i], visitor, path);
            if (typeof ci === "number")
              i = ci - 1;
            else if (ci === BREAK)
              return BREAK;
            else if (ci === REMOVE) {
              node.items.splice(i, 1);
              i -= 1;
            }
          }
        } else if (identity.isPair(node)) {
          path = Object.freeze(path.concat(node));
          const ck = await visitAsync_("key", node.key, visitor, path);
          if (ck === BREAK)
            return BREAK;
          else if (ck === REMOVE)
            node.key = null;
          const cv = await visitAsync_("value", node.value, visitor, path);
          if (cv === BREAK)
            return BREAK;
          else if (cv === REMOVE)
            node.value = null;
        }
      }
      return ctrl;
    }
    function initVisitor(visitor) {
      if (typeof visitor === "object" && (visitor.Collection || visitor.Node || visitor.Value)) {
        return Object.assign({
          Alias: visitor.Node,
          Map: visitor.Node,
          Scalar: visitor.Node,
          Seq: visitor.Node
        }, visitor.Value && {
          Map: visitor.Value,
          Scalar: visitor.Value,
          Seq: visitor.Value
        }, visitor.Collection && {
          Map: visitor.Collection,
          Seq: visitor.Collection
        }, visitor);
      }
      return visitor;
    }
    function callVisitor(key, node, visitor, path) {
      if (typeof visitor === "function")
        return visitor(key, node, path);
      if (identity.isMap(node))
        return visitor.Map?.(key, node, path);
      if (identity.isSeq(node))
        return visitor.Seq?.(key, node, path);
      if (identity.isPair(node))
        return visitor.Pair?.(key, node, path);
      if (identity.isScalar(node))
        return visitor.Scalar?.(key, node, path);
      if (identity.isAlias(node))
        return visitor.Alias?.(key, node, path);
      return void 0;
    }
    function replaceNode(key, path, node) {
      const parent = path[path.length - 1];
      if (identity.isCollection(parent)) {
        parent.items[key] = node;
      } else if (identity.isPair(parent)) {
        if (key === "key")
          parent.key = node;
        else
          parent.value = node;
      } else if (identity.isDocument(parent)) {
        parent.contents = node;
      } else {
        const pt = identity.isAlias(parent) ? "alias" : "scalar";
        throw new Error(`Cannot replace node with ${pt} parent`);
      }
    }
    exports.visit = visit;
    exports.visitAsync = visitAsync;
  }
});

// ../../node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/doc/directives.js
var require_directives = __commonJS({
  "../../node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/doc/directives.js"(exports) {
    "use strict";
    var identity = require_identity();
    var visit = require_visit();
    var escapeChars = {
      "!": "%21",
      ",": "%2C",
      "[": "%5B",
      "]": "%5D",
      "{": "%7B",
      "}": "%7D"
    };
    var escapeTagName = (tn) => tn.replace(/[!,[\]{}]/g, (ch) => escapeChars[ch]);
    var Directives = class _Directives {
      constructor(yaml2, tags) {
        this.docStart = null;
        this.docEnd = false;
        this.yaml = Object.assign({}, _Directives.defaultYaml, yaml2);
        this.tags = Object.assign({}, _Directives.defaultTags, tags);
      }
      clone() {
        const copy = new _Directives(this.yaml, this.tags);
        copy.docStart = this.docStart;
        return copy;
      }
      /**
       * During parsing, get a Directives instance for the current document and
       * update the stream state according to the current version's spec.
       */
      atDocument() {
        const res = new _Directives(this.yaml, this.tags);
        switch (this.yaml.version) {
          case "1.1":
            this.atNextDocument = true;
            break;
          case "1.2":
            this.atNextDocument = false;
            this.yaml = {
              explicit: _Directives.defaultYaml.explicit,
              version: "1.2"
            };
            this.tags = Object.assign({}, _Directives.defaultTags);
            break;
        }
        return res;
      }
      /**
       * @param onError - May be called even if the action was successful
       * @returns `true` on success
       */
      add(line, onError) {
        if (this.atNextDocument) {
          this.yaml = { explicit: _Directives.defaultYaml.explicit, version: "1.1" };
          this.tags = Object.assign({}, _Directives.defaultTags);
          this.atNextDocument = false;
        }
        const parts = line.trim().split(/[ \t]+/);
        const name = parts.shift();
        switch (name) {
          case "%TAG": {
            if (parts.length !== 2) {
              onError(0, "%TAG directive should contain exactly two parts");
              if (parts.length < 2)
                return false;
            }
            const [handle3, prefix] = parts;
            this.tags[handle3] = prefix;
            return true;
          }
          case "%YAML": {
            this.yaml.explicit = true;
            if (parts.length !== 1) {
              onError(0, "%YAML directive should contain exactly one part");
              return false;
            }
            const [version] = parts;
            if (version === "1.1" || version === "1.2") {
              this.yaml.version = version;
              return true;
            } else {
              const isValid2 = /^\d+\.\d+$/.test(version);
              onError(6, `Unsupported YAML version ${version}`, isValid2);
              return false;
            }
          }
          default:
            onError(0, `Unknown directive ${name}`, true);
            return false;
        }
      }
      /**
       * Resolves a tag, matching handles to those defined in %TAG directives.
       *
       * @returns Resolved tag, which may also be the non-specific tag `'!'` or a
       *   `'!local'` tag, or `null` if unresolvable.
       */
      tagName(source, onError) {
        if (source === "!")
          return "!";
        if (source[0] !== "!") {
          onError(`Not a valid tag: ${source}`);
          return null;
        }
        if (source[1] === "<") {
          const verbatim = source.slice(2, -1);
          if (verbatim === "!" || verbatim === "!!") {
            onError(`Verbatim tags aren't resolved, so ${source} is invalid.`);
            return null;
          }
          if (source[source.length - 1] !== ">")
            onError("Verbatim tags must end with a >");
          return verbatim;
        }
        const [, handle3, suffix] = source.match(/^(.*!)([^!]*)$/s);
        if (!suffix)
          onError(`The ${source} tag has no suffix`);
        const prefix = this.tags[handle3];
        if (prefix) {
          try {
            return prefix + decodeURIComponent(suffix);
          } catch (error) {
            onError(String(error));
            return null;
          }
        }
        if (handle3 === "!")
          return source;
        onError(`Could not resolve tag: ${source}`);
        return null;
      }
      /**
       * Given a fully resolved tag, returns its printable string form,
       * taking into account current tag prefixes and defaults.
       */
      tagString(tag) {
        for (const [handle3, prefix] of Object.entries(this.tags)) {
          if (tag.startsWith(prefix))
            return handle3 + escapeTagName(tag.substring(prefix.length));
        }
        return tag[0] === "!" ? tag : `!<${tag}>`;
      }
      toString(doc) {
        const lines = this.yaml.explicit ? [`%YAML ${this.yaml.version || "1.2"}`] : [];
        const tagEntries = Object.entries(this.tags);
        let tagNames;
        if (doc && tagEntries.length > 0 && identity.isNode(doc.contents)) {
          const tags = {};
          visit.visit(doc.contents, (_key, node) => {
            if (identity.isNode(node) && node.tag)
              tags[node.tag] = true;
          });
          tagNames = Object.keys(tags);
        } else
          tagNames = [];
        for (const [handle3, prefix] of tagEntries) {
          if (handle3 === "!!" && prefix === "tag:yaml.org,2002:")
            continue;
          if (!doc || tagNames.some((tn) => tn.startsWith(prefix)))
            lines.push(`%TAG ${handle3} ${prefix}`);
        }
        return lines.join("\n");
      }
    };
    Directives.defaultYaml = { explicit: false, version: "1.2" };
    Directives.defaultTags = { "!!": "tag:yaml.org,2002:" };
    exports.Directives = Directives;
  }
});

// ../../node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/doc/anchors.js
var require_anchors = __commonJS({
  "../../node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/doc/anchors.js"(exports) {
    "use strict";
    var identity = require_identity();
    var visit = require_visit();
    function anchorIsValid(anchor) {
      if (/[\x00-\x19\s,[\]{}]/.test(anchor)) {
        const sa = JSON.stringify(anchor);
        const msg = `Anchor must not contain whitespace or control characters: ${sa}`;
        throw new Error(msg);
      }
      return true;
    }
    function anchorNames(root) {
      const anchors = /* @__PURE__ */ new Set();
      visit.visit(root, {
        Value(_key, node) {
          if (node.anchor)
            anchors.add(node.anchor);
        }
      });
      return anchors;
    }
    function findNewAnchor(prefix, exclude) {
      for (let i = 1; true; ++i) {
        const name = `${prefix}${i}`;
        if (!exclude.has(name))
          return name;
      }
    }
    function createNodeAnchors(doc, prefix) {
      const aliasObjects = [];
      const sourceObjects = /* @__PURE__ */ new Map();
      let prevAnchors = null;
      return {
        onAnchor: (source) => {
          aliasObjects.push(source);
          prevAnchors ?? (prevAnchors = anchorNames(doc));
          const anchor = findNewAnchor(prefix, prevAnchors);
          prevAnchors.add(anchor);
          return anchor;
        },
        /**
         * With circular references, the source node is only resolved after all
         * of its child nodes are. This is why anchors are set only after all of
         * the nodes have been created.
         */
        setAnchors: () => {
          for (const source of aliasObjects) {
            const ref = sourceObjects.get(source);
            if (typeof ref === "object" && ref.anchor && (identity.isScalar(ref.node) || identity.isCollection(ref.node))) {
              ref.node.anchor = ref.anchor;
            } else {
              const error = new Error("Failed to resolve repeated object (this should not happen)");
              error.source = source;
              throw error;
            }
          }
        },
        sourceObjects
      };
    }
    exports.anchorIsValid = anchorIsValid;
    exports.anchorNames = anchorNames;
    exports.createNodeAnchors = createNodeAnchors;
    exports.findNewAnchor = findNewAnchor;
  }
});

// ../../node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/doc/applyReviver.js
var require_applyReviver = __commonJS({
  "../../node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/doc/applyReviver.js"(exports) {
    "use strict";
    function applyReviver(reviver, obj, key, val) {
      if (val && typeof val === "object") {
        if (Array.isArray(val)) {
          for (let i = 0, len = val.length; i < len; ++i) {
            const v0 = val[i];
            const v1 = applyReviver(reviver, val, String(i), v0);
            if (v1 === void 0)
              delete val[i];
            else if (v1 !== v0)
              val[i] = v1;
          }
        } else if (val instanceof Map) {
          for (const k of Array.from(val.keys())) {
            const v0 = val.get(k);
            const v1 = applyReviver(reviver, val, k, v0);
            if (v1 === void 0)
              val.delete(k);
            else if (v1 !== v0)
              val.set(k, v1);
          }
        } else if (val instanceof Set) {
          for (const v0 of Array.from(val)) {
            const v1 = applyReviver(reviver, val, v0, v0);
            if (v1 === void 0)
              val.delete(v0);
            else if (v1 !== v0) {
              val.delete(v0);
              val.add(v1);
            }
          }
        } else {
          for (const [k, v0] of Object.entries(val)) {
            const v1 = applyReviver(reviver, val, k, v0);
            if (v1 === void 0)
              delete val[k];
            else if (v1 !== v0)
              val[k] = v1;
          }
        }
      }
      return reviver.call(obj, key, val);
    }
    exports.applyReviver = applyReviver;
  }
});

// ../../node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/nodes/toJS.js
var require_toJS = __commonJS({
  "../../node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/nodes/toJS.js"(exports) {
    "use strict";
    var identity = require_identity();
    function toJS(value, arg, ctx) {
      if (Array.isArray(value))
        return value.map((v, i) => toJS(v, String(i), ctx));
      if (value && typeof value.toJSON === "function") {
        if (!ctx || !identity.hasAnchor(value))
          return value.toJSON(arg, ctx);
        const data = { aliasCount: 0, count: 1, res: void 0 };
        ctx.anchors.set(value, data);
        ctx.onCreate = (res2) => {
          data.res = res2;
          delete ctx.onCreate;
        };
        const res = value.toJSON(arg, ctx);
        if (ctx.onCreate)
          ctx.onCreate(res);
        return res;
      }
      if (typeof value === "bigint" && !ctx?.keep)
        return Number(value);
      return value;
    }
    exports.toJS = toJS;
  }
});

// ../../node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/nodes/Node.js
var require_Node = __commonJS({
  "../../node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/nodes/Node.js"(exports) {
    "use strict";
    var applyReviver = require_applyReviver();
    var identity = require_identity();
    var toJS = require_toJS();
    var NodeBase = class {
      constructor(type) {
        Object.defineProperty(this, identity.NODE_TYPE, { value: type });
      }
      /** Create a copy of this node.  */
      clone() {
        const copy = Object.create(Object.getPrototypeOf(this), Object.getOwnPropertyDescriptors(this));
        if (this.range)
          copy.range = this.range.slice();
        return copy;
      }
      /** A plain JavaScript representation of this node. */
      toJS(doc, { mapAsMap, maxAliasCount, onAnchor, reviver } = {}) {
        if (!identity.isDocument(doc))
          throw new TypeError("A document argument is required");
        const ctx = {
          anchors: /* @__PURE__ */ new Map(),
          doc,
          keep: true,
          mapAsMap: mapAsMap === true,
          mapKeyWarned: false,
          maxAliasCount: typeof maxAliasCount === "number" ? maxAliasCount : 100
        };
        const res = toJS.toJS(this, "", ctx);
        if (typeof onAnchor === "function")
          for (const { count, res: res2 } of ctx.anchors.values())
            onAnchor(res2, count);
        return typeof reviver === "function" ? applyReviver.applyReviver(reviver, { "": res }, "", res) : res;
      }
    };
    exports.NodeBase = NodeBase;
  }
});

// ../../node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/nodes/Alias.js
var require_Alias = __commonJS({
  "../../node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/nodes/Alias.js"(exports) {
    "use strict";
    var anchors = require_anchors();
    var visit = require_visit();
    var identity = require_identity();
    var Node = require_Node();
    var toJS = require_toJS();
    var Alias = class extends Node.NodeBase {
      constructor(source) {
        super(identity.ALIAS);
        this.source = source;
        Object.defineProperty(this, "tag", {
          set() {
            throw new Error("Alias nodes cannot have tags");
          }
        });
      }
      /**
       * Resolve the value of this alias within `doc`, finding the last
       * instance of the `source` anchor before this node.
       */
      resolve(doc, ctx) {
        if (ctx?.maxAliasCount === 0)
          throw new ReferenceError("Alias resolution is disabled");
        let nodes;
        if (ctx?.aliasResolveCache) {
          nodes = ctx.aliasResolveCache;
        } else {
          nodes = [];
          visit.visit(doc, {
            Node: (_key, node) => {
              if (identity.isAlias(node) || identity.hasAnchor(node))
                nodes.push(node);
            }
          });
          if (ctx)
            ctx.aliasResolveCache = nodes;
        }
        let found = void 0;
        for (const node of nodes) {
          if (node === this)
            break;
          if (node.anchor === this.source)
            found = node;
        }
        return found;
      }
      toJSON(_arg, ctx) {
        if (!ctx)
          return { source: this.source };
        const { anchors: anchors2, doc, maxAliasCount } = ctx;
        const source = this.resolve(doc, ctx);
        if (!source) {
          const msg = `Unresolved alias (the anchor must be set before the alias): ${this.source}`;
          throw new ReferenceError(msg);
        }
        let data = anchors2.get(source);
        if (!data) {
          toJS.toJS(source, null, ctx);
          data = anchors2.get(source);
        }
        if (data?.res === void 0) {
          const msg = "This should not happen: Alias anchor was not resolved?";
          throw new ReferenceError(msg);
        }
        if (maxAliasCount >= 0) {
          data.count += 1;
          if (data.aliasCount === 0)
            data.aliasCount = getAliasCount(doc, source, anchors2);
          if (data.count * data.aliasCount > maxAliasCount) {
            const msg = "Excessive alias count indicates a resource exhaustion attack";
            throw new ReferenceError(msg);
          }
        }
        return data.res;
      }
      toString(ctx, _onComment, _onChompKeep) {
        const src = `*${this.source}`;
        if (ctx) {
          anchors.anchorIsValid(this.source);
          if (ctx.options.verifyAliasOrder && !ctx.anchors.has(this.source)) {
            const msg = `Unresolved alias (the anchor must be set before the alias): ${this.source}`;
            throw new Error(msg);
          }
          if (ctx.implicitKey)
            return `${src} `;
        }
        return src;
      }
    };
    function getAliasCount(doc, node, anchors2) {
      if (identity.isAlias(node)) {
        const source = node.resolve(doc);
        const anchor = anchors2 && source && anchors2.get(source);
        return anchor ? anchor.count * anchor.aliasCount : 0;
      } else if (identity.isCollection(node)) {
        let count = 0;
        for (const item of node.items) {
          const c = getAliasCount(doc, item, anchors2);
          if (c > count)
            count = c;
        }
        return count;
      } else if (identity.isPair(node)) {
        const kc = getAliasCount(doc, node.key, anchors2);
        const vc = getAliasCount(doc, node.value, anchors2);
        return Math.max(kc, vc);
      }
      return 1;
    }
    exports.Alias = Alias;
  }
});

// ../../node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/nodes/Scalar.js
var require_Scalar = __commonJS({
  "../../node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/nodes/Scalar.js"(exports) {
    "use strict";
    var identity = require_identity();
    var Node = require_Node();
    var toJS = require_toJS();
    var isScalarValue = (value) => !value || typeof value !== "function" && typeof value !== "object";
    var Scalar = class extends Node.NodeBase {
      constructor(value) {
        super(identity.SCALAR);
        this.value = value;
      }
      toJSON(arg, ctx) {
        return ctx?.keep ? this.value : toJS.toJS(this.value, arg, ctx);
      }
      toString() {
        return String(this.value);
      }
    };
    Scalar.BLOCK_FOLDED = "BLOCK_FOLDED";
    Scalar.BLOCK_LITERAL = "BLOCK_LITERAL";
    Scalar.PLAIN = "PLAIN";
    Scalar.QUOTE_DOUBLE = "QUOTE_DOUBLE";
    Scalar.QUOTE_SINGLE = "QUOTE_SINGLE";
    exports.Scalar = Scalar;
    exports.isScalarValue = isScalarValue;
  }
});

// ../../node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/doc/createNode.js
var require_createNode = __commonJS({
  "../../node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/doc/createNode.js"(exports) {
    "use strict";
    var Alias = require_Alias();
    var identity = require_identity();
    var Scalar = require_Scalar();
    var defaultTagPrefix = "tag:yaml.org,2002:";
    function findTagObject(value, tagName, tags) {
      if (tagName) {
        const match = tags.filter((t) => t.tag === tagName);
        const tagObj = match.find((t) => !t.format) ?? match[0];
        if (!tagObj)
          throw new Error(`Tag ${tagName} not found`);
        return tagObj;
      }
      return tags.find((t) => t.identify?.(value) && !t.format);
    }
    function createNode(value, tagName, ctx) {
      if (identity.isDocument(value))
        value = value.contents;
      if (identity.isNode(value))
        return value;
      if (identity.isPair(value)) {
        const map = ctx.schema[identity.MAP].createNode?.(ctx.schema, null, ctx);
        map.items.push(value);
        return map;
      }
      if (value instanceof String || value instanceof Number || value instanceof Boolean || typeof BigInt !== "undefined" && value instanceof BigInt) {
        value = value.valueOf();
      }
      const { aliasDuplicateObjects, onAnchor, onTagObj, schema, sourceObjects } = ctx;
      let ref = void 0;
      if (aliasDuplicateObjects && value && typeof value === "object") {
        ref = sourceObjects.get(value);
        if (ref) {
          ref.anchor ?? (ref.anchor = onAnchor(value));
          return new Alias.Alias(ref.anchor);
        } else {
          ref = { anchor: null, node: null };
          sourceObjects.set(value, ref);
        }
      }
      if (tagName?.startsWith("!!"))
        tagName = defaultTagPrefix + tagName.slice(2);
      let tagObj = findTagObject(value, tagName, schema.tags);
      if (!tagObj) {
        if (value && typeof value.toJSON === "function") {
          value = value.toJSON();
        }
        if (!value || typeof value !== "object") {
          const node2 = new Scalar.Scalar(value);
          if (ref)
            ref.node = node2;
          return node2;
        }
        tagObj = value instanceof Map ? schema[identity.MAP] : Symbol.iterator in Object(value) ? schema[identity.SEQ] : schema[identity.MAP];
      }
      if (onTagObj) {
        onTagObj(tagObj);
        delete ctx.onTagObj;
      }
      const node = tagObj?.createNode ? tagObj.createNode(ctx.schema, value, ctx) : typeof tagObj?.nodeClass?.from === "function" ? tagObj.nodeClass.from(ctx.schema, value, ctx) : new Scalar.Scalar(value);
      if (tagName)
        node.tag = tagName;
      else if (!tagObj.default)
        node.tag = tagObj.tag;
      if (ref)
        ref.node = node;
      return node;
    }
    exports.createNode = createNode;
  }
});

// ../../node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/nodes/Collection.js
var require_Collection = __commonJS({
  "../../node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/nodes/Collection.js"(exports) {
    "use strict";
    var createNode = require_createNode();
    var identity = require_identity();
    var Node = require_Node();
    function collectionFromPath(schema, path, value) {
      let v = value;
      for (let i = path.length - 1; i >= 0; --i) {
        const k = path[i];
        if (typeof k === "number" && Number.isInteger(k) && k >= 0) {
          const a = [];
          a[k] = v;
          v = a;
        } else {
          v = /* @__PURE__ */ new Map([[k, v]]);
        }
      }
      return createNode.createNode(v, void 0, {
        aliasDuplicateObjects: false,
        keepUndefined: false,
        onAnchor: () => {
          throw new Error("This should not happen, please report a bug.");
        },
        schema,
        sourceObjects: /* @__PURE__ */ new Map()
      });
    }
    var isEmptyPath = (path) => path == null || typeof path === "object" && !!path[Symbol.iterator]().next().done;
    var Collection = class extends Node.NodeBase {
      constructor(type, schema) {
        super(type);
        Object.defineProperty(this, "schema", {
          value: schema,
          configurable: true,
          enumerable: false,
          writable: true
        });
      }
      /**
       * Create a copy of this collection.
       *
       * @param schema - If defined, overwrites the original's schema
       */
      clone(schema) {
        const copy = Object.create(Object.getPrototypeOf(this), Object.getOwnPropertyDescriptors(this));
        if (schema)
          copy.schema = schema;
        copy.items = copy.items.map((it) => identity.isNode(it) || identity.isPair(it) ? it.clone(schema) : it);
        if (this.range)
          copy.range = this.range.slice();
        return copy;
      }
      /**
       * Adds a value to the collection. For `!!map` and `!!omap` the value must
       * be a Pair instance or a `{ key, value }` object, which may not have a key
       * that already exists in the map.
       */
      addIn(path, value) {
        if (isEmptyPath(path))
          this.add(value);
        else {
          const [key, ...rest] = path;
          const node = this.get(key, true);
          if (identity.isCollection(node))
            node.addIn(rest, value);
          else if (node === void 0 && this.schema)
            this.set(key, collectionFromPath(this.schema, rest, value));
          else
            throw new Error(`Expected YAML collection at ${key}. Remaining path: ${rest}`);
        }
      }
      /**
       * Removes a value from the collection.
       * @returns `true` if the item was found and removed.
       */
      deleteIn(path) {
        const [key, ...rest] = path;
        if (rest.length === 0)
          return this.delete(key);
        const node = this.get(key, true);
        if (identity.isCollection(node))
          return node.deleteIn(rest);
        else
          throw new Error(`Expected YAML collection at ${key}. Remaining path: ${rest}`);
      }
      /**
       * Returns item at `key`, or `undefined` if not found. By default unwraps
       * scalar values from their surrounding node; to disable set `keepScalar` to
       * `true` (collections are always returned intact).
       */
      getIn(path, keepScalar) {
        const [key, ...rest] = path;
        const node = this.get(key, true);
        if (rest.length === 0)
          return !keepScalar && identity.isScalar(node) ? node.value : node;
        else
          return identity.isCollection(node) ? node.getIn(rest, keepScalar) : void 0;
      }
      hasAllNullValues(allowScalar) {
        return this.items.every((node) => {
          if (!identity.isPair(node))
            return false;
          const n = node.value;
          return n == null || allowScalar && identity.isScalar(n) && n.value == null && !n.commentBefore && !n.comment && !n.tag;
        });
      }
      /**
       * Checks if the collection includes a value with the key `key`.
       */
      hasIn(path) {
        const [key, ...rest] = path;
        if (rest.length === 0)
          return this.has(key);
        const node = this.get(key, true);
        return identity.isCollection(node) ? node.hasIn(rest) : false;
      }
      /**
       * Sets a value in this collection. For `!!set`, `value` needs to be a
       * boolean to add/remove the item from the set.
       */
      setIn(path, value) {
        const [key, ...rest] = path;
        if (rest.length === 0) {
          this.set(key, value);
        } else {
          const node = this.get(key, true);
          if (identity.isCollection(node))
            node.setIn(rest, value);
          else if (node === void 0 && this.schema)
            this.set(key, collectionFromPath(this.schema, rest, value));
          else
            throw new Error(`Expected YAML collection at ${key}. Remaining path: ${rest}`);
        }
      }
    };
    exports.Collection = Collection;
    exports.collectionFromPath = collectionFromPath;
    exports.isEmptyPath = isEmptyPath;
  }
});

// ../../node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/stringify/stringifyComment.js
var require_stringifyComment = __commonJS({
  "../../node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/stringify/stringifyComment.js"(exports) {
    "use strict";
    var stringifyComment = (str3) => str3.replace(/^(?!$)(?: $)?/gm, "#");
    function indentComment(comment, indent) {
      if (/^\n+$/.test(comment))
        return comment.substring(1);
      return indent ? comment.replace(/^(?! *$)/gm, indent) : comment;
    }
    var lineComment = (str3, indent, comment) => str3.endsWith("\n") ? indentComment(comment, indent) : comment.includes("\n") ? "\n" + indentComment(comment, indent) : (str3.endsWith(" ") ? "" : " ") + comment;
    exports.indentComment = indentComment;
    exports.lineComment = lineComment;
    exports.stringifyComment = stringifyComment;
  }
});

// ../../node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/stringify/foldFlowLines.js
var require_foldFlowLines = __commonJS({
  "../../node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/stringify/foldFlowLines.js"(exports) {
    "use strict";
    var FOLD_FLOW = "flow";
    var FOLD_BLOCK = "block";
    var FOLD_QUOTED = "quoted";
    function foldFlowLines(text, indent, mode = "flow", { indentAtStart, lineWidth = 80, minContentWidth = 20, onFold, onOverflow } = {}) {
      if (!lineWidth || lineWidth < 0)
        return text;
      if (lineWidth < minContentWidth)
        minContentWidth = 0;
      const endStep = Math.max(1 + minContentWidth, 1 + lineWidth - indent.length);
      if (text.length <= endStep)
        return text;
      const folds = [];
      const escapedFolds = {};
      let end = lineWidth - indent.length;
      if (typeof indentAtStart === "number") {
        if (indentAtStart > lineWidth - Math.max(2, minContentWidth))
          folds.push(0);
        else
          end = lineWidth - indentAtStart;
      }
      let split = void 0;
      let prev = void 0;
      let overflow = false;
      let i = -1;
      let escStart = -1;
      let escEnd = -1;
      if (mode === FOLD_BLOCK) {
        i = consumeMoreIndentedLines(text, i, indent.length);
        if (i !== -1)
          end = i + endStep;
      }
      for (let ch; ch = text[i += 1]; ) {
        if (mode === FOLD_QUOTED && ch === "\\") {
          escStart = i;
          switch (text[i + 1]) {
            case "x":
              i += 3;
              break;
            case "u":
              i += 5;
              break;
            case "U":
              i += 9;
              break;
            default:
              i += 1;
          }
          escEnd = i;
        }
        if (ch === "\n") {
          if (mode === FOLD_BLOCK)
            i = consumeMoreIndentedLines(text, i, indent.length);
          end = i + indent.length + endStep;
          split = void 0;
        } else {
          if (ch === " " && prev && prev !== " " && prev !== "\n" && prev !== "	") {
            const next = text[i + 1];
            if (next && next !== " " && next !== "\n" && next !== "	")
              split = i;
          }
          if (i >= end) {
            if (split) {
              folds.push(split);
              end = split + endStep;
              split = void 0;
            } else if (mode === FOLD_QUOTED) {
              while (prev === " " || prev === "	") {
                prev = ch;
                ch = text[i += 1];
                overflow = true;
              }
              const j = i > escEnd + 1 ? i - 2 : escStart - 1;
              if (escapedFolds[j])
                return text;
              folds.push(j);
              escapedFolds[j] = true;
              end = j + endStep;
              split = void 0;
            } else {
              overflow = true;
            }
          }
        }
        prev = ch;
      }
      if (overflow && onOverflow)
        onOverflow();
      if (folds.length === 0)
        return text;
      if (onFold)
        onFold();
      let res = text.slice(0, folds[0]);
      for (let i2 = 0; i2 < folds.length; ++i2) {
        const fold = folds[i2];
        const end2 = folds[i2 + 1] || text.length;
        if (fold === 0)
          res = `
${indent}${text.slice(0, end2)}`;
        else {
          if (mode === FOLD_QUOTED && escapedFolds[fold])
            res += `${text[fold]}\\`;
          res += `
${indent}${text.slice(fold + 1, end2)}`;
        }
      }
      return res;
    }
    function consumeMoreIndentedLines(text, i, indent) {
      let end = i;
      let start = i + 1;
      let ch = text[start];
      while (ch === " " || ch === "	") {
        if (i < start + indent) {
          ch = text[++i];
        } else {
          do {
            ch = text[++i];
          } while (ch && ch !== "\n");
          end = i;
          start = i + 1;
          ch = text[start];
        }
      }
      return end;
    }
    exports.FOLD_BLOCK = FOLD_BLOCK;
    exports.FOLD_FLOW = FOLD_FLOW;
    exports.FOLD_QUOTED = FOLD_QUOTED;
    exports.foldFlowLines = foldFlowLines;
  }
});

// ../../node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/stringify/stringifyString.js
var require_stringifyString = __commonJS({
  "../../node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/stringify/stringifyString.js"(exports) {
    "use strict";
    var Scalar = require_Scalar();
    var foldFlowLines = require_foldFlowLines();
    var getFoldOptions = (ctx, isBlock) => ({
      indentAtStart: isBlock ? ctx.indent.length : ctx.indentAtStart,
      lineWidth: ctx.options.lineWidth,
      minContentWidth: ctx.options.minContentWidth
    });
    var containsDocumentMarker = (str3) => /^(%|---|\.\.\.)/m.test(str3);
    function lineLengthOverLimit(str3, lineWidth, indentLength) {
      if (!lineWidth || lineWidth < 0)
        return false;
      const limit = lineWidth - indentLength;
      const strLen = str3.length;
      if (strLen <= limit)
        return false;
      for (let i = 0, start = 0; i < strLen; ++i) {
        if (str3[i] === "\n") {
          if (i - start > limit)
            return true;
          start = i + 1;
          if (strLen - start <= limit)
            return false;
        }
      }
      return true;
    }
    function doubleQuotedString(value, ctx) {
      const json = JSON.stringify(value);
      if (ctx.options.doubleQuotedAsJSON)
        return json;
      const { implicitKey } = ctx;
      const minMultiLineLength = ctx.options.doubleQuotedMinMultiLineLength;
      const indent = ctx.indent || (containsDocumentMarker(value) ? "  " : "");
      let str3 = "";
      let start = 0;
      for (let i = 0, ch = json[i]; ch; ch = json[++i]) {
        if (ch === " " && json[i + 1] === "\\" && json[i + 2] === "n") {
          str3 += json.slice(start, i) + "\\ ";
          i += 1;
          start = i;
          ch = "\\";
        }
        if (ch === "\\")
          switch (json[i + 1]) {
            case "u":
              {
                str3 += json.slice(start, i);
                const code = json.substr(i + 2, 4);
                switch (code) {
                  case "0000":
                    str3 += "\\0";
                    break;
                  case "0007":
                    str3 += "\\a";
                    break;
                  case "000b":
                    str3 += "\\v";
                    break;
                  case "001b":
                    str3 += "\\e";
                    break;
                  case "0085":
                    str3 += "\\N";
                    break;
                  case "00a0":
                    str3 += "\\_";
                    break;
                  case "2028":
                    str3 += "\\L";
                    break;
                  case "2029":
                    str3 += "\\P";
                    break;
                  default:
                    if (code.substr(0, 2) === "00")
                      str3 += "\\x" + code.substr(2);
                    else
                      str3 += json.substr(i, 6);
                }
                i += 5;
                start = i + 1;
              }
              break;
            case "n":
              if (implicitKey || json[i + 2] === '"' || json.length < minMultiLineLength) {
                i += 1;
              } else {
                str3 += json.slice(start, i) + "\n\n";
                while (json[i + 2] === "\\" && json[i + 3] === "n" && json[i + 4] !== '"') {
                  str3 += "\n";
                  i += 2;
                }
                str3 += indent;
                if (json[i + 2] === " ")
                  str3 += "\\";
                i += 1;
                start = i + 1;
              }
              break;
            default:
              i += 1;
          }
      }
      str3 = start ? str3 + json.slice(start) : json;
      return implicitKey ? str3 : foldFlowLines.foldFlowLines(str3, indent, foldFlowLines.FOLD_QUOTED, getFoldOptions(ctx, false));
    }
    function singleQuotedString(value, ctx) {
      if (ctx.options.singleQuote === false || ctx.implicitKey && value.includes("\n") || /[ \t]\n|\n[ \t]/.test(value))
        return doubleQuotedString(value, ctx);
      const indent = ctx.indent || (containsDocumentMarker(value) ? "  " : "");
      const res = "'" + value.replace(/'/g, "''").replace(/\n+/g, `$&
${indent}`) + "'";
      return ctx.implicitKey ? res : foldFlowLines.foldFlowLines(res, indent, foldFlowLines.FOLD_FLOW, getFoldOptions(ctx, false));
    }
    function quotedString(value, ctx) {
      const { singleQuote } = ctx.options;
      let qs;
      if (singleQuote === false)
        qs = doubleQuotedString;
      else {
        const hasDouble = value.includes('"');
        const hasSingle = value.includes("'");
        if (hasDouble && !hasSingle)
          qs = singleQuotedString;
        else if (hasSingle && !hasDouble)
          qs = doubleQuotedString;
        else
          qs = singleQuote ? singleQuotedString : doubleQuotedString;
      }
      return qs(value, ctx);
    }
    var blockEndNewlines;
    try {
      blockEndNewlines = new RegExp("(^|(?<!\n))\n+(?!\n|$)", "g");
    } catch {
      blockEndNewlines = /\n+(?!\n|$)/g;
    }
    function blockString({ comment, type, value }, ctx, onComment, onChompKeep) {
      const { blockQuote, commentString, lineWidth } = ctx.options;
      if (!blockQuote || /\n[\t ]+$/.test(value)) {
        return quotedString(value, ctx);
      }
      const indent = ctx.indent || (ctx.forceBlockIndent || containsDocumentMarker(value) ? "  " : "");
      const literal = blockQuote === "literal" ? true : blockQuote === "folded" || type === Scalar.Scalar.BLOCK_FOLDED ? false : type === Scalar.Scalar.BLOCK_LITERAL ? true : !lineLengthOverLimit(value, lineWidth, indent.length);
      if (!value)
        return literal ? "|\n" : ">\n";
      let chomp;
      let endStart;
      for (endStart = value.length; endStart > 0; --endStart) {
        const ch = value[endStart - 1];
        if (ch !== "\n" && ch !== "	" && ch !== " ")
          break;
      }
      let end = value.substring(endStart);
      const endNlPos = end.indexOf("\n");
      if (endNlPos === -1) {
        chomp = "-";
      } else if (value === end || endNlPos !== end.length - 1) {
        chomp = "+";
        if (onChompKeep)
          onChompKeep();
      } else {
        chomp = "";
      }
      if (end) {
        value = value.slice(0, -end.length);
        if (end[end.length - 1] === "\n")
          end = end.slice(0, -1);
        end = end.replace(blockEndNewlines, `$&${indent}`);
      }
      let startWithSpace = false;
      let startEnd;
      let startNlPos = -1;
      for (startEnd = 0; startEnd < value.length; ++startEnd) {
        const ch = value[startEnd];
        if (ch === " ")
          startWithSpace = true;
        else if (ch === "\n")
          startNlPos = startEnd;
        else
          break;
      }
      let start = value.substring(0, startNlPos < startEnd ? startNlPos + 1 : startEnd);
      if (start) {
        value = value.substring(start.length);
        start = start.replace(/\n+/g, `$&${indent}`);
      }
      const indentSize = indent ? "2" : "1";
      let header = (startWithSpace ? indentSize : "") + chomp;
      if (comment) {
        header += " " + commentString(comment.replace(/ ?[\r\n]+/g, " "));
        if (onComment)
          onComment();
      }
      if (!literal) {
        const foldedValue = value.replace(/\n+/g, "\n$&").replace(/(?:^|\n)([\t ].*)(?:([\n\t ]*)\n(?![\n\t ]))?/g, "$1$2").replace(/\n+/g, `$&${indent}`);
        let literalFallback = false;
        const foldOptions = getFoldOptions(ctx, true);
        if (blockQuote !== "folded" && type !== Scalar.Scalar.BLOCK_FOLDED) {
          foldOptions.onOverflow = () => {
            literalFallback = true;
          };
        }
        const body = foldFlowLines.foldFlowLines(`${start}${foldedValue}${end}`, indent, foldFlowLines.FOLD_BLOCK, foldOptions);
        if (!literalFallback)
          return `>${header}
${indent}${body}`;
      }
      value = value.replace(/\n+/g, `$&${indent}`);
      return `|${header}
${indent}${start}${value}${end}`;
    }
    function plainString(item, ctx, onComment, onChompKeep) {
      const { type, value } = item;
      const { actualString, implicitKey, indent, indentStep, inFlow } = ctx;
      if (implicitKey && value.includes("\n") || inFlow && /[[\]{},]/.test(value)) {
        return quotedString(value, ctx);
      }
      if (/^[\n\t ,[\]{}#&*!|>'"%@`]|^[?-]$|^[?-][ \t]|[\n:][ \t]|[ \t]\n|[\n\t ]#|[\n\t :]$/.test(value)) {
        return implicitKey || inFlow || !value.includes("\n") ? quotedString(value, ctx) : blockString(item, ctx, onComment, onChompKeep);
      }
      if (!implicitKey && !inFlow && type !== Scalar.Scalar.PLAIN && value.includes("\n")) {
        return blockString(item, ctx, onComment, onChompKeep);
      }
      if (containsDocumentMarker(value)) {
        if (indent === "") {
          ctx.forceBlockIndent = true;
          return blockString(item, ctx, onComment, onChompKeep);
        } else if (implicitKey && indent === indentStep) {
          return quotedString(value, ctx);
        }
      }
      const str3 = value.replace(/\n+/g, `$&
${indent}`);
      if (actualString) {
        const test = (tag) => tag.default && tag.tag !== "tag:yaml.org,2002:str" && tag.test?.test(str3);
        const { compat, tags } = ctx.doc.schema;
        if (tags.some(test) || compat?.some(test))
          return quotedString(value, ctx);
      }
      return implicitKey ? str3 : foldFlowLines.foldFlowLines(str3, indent, foldFlowLines.FOLD_FLOW, getFoldOptions(ctx, false));
    }
    function stringifyString(item, ctx, onComment, onChompKeep) {
      const { implicitKey, inFlow } = ctx;
      const ss = typeof item.value === "string" ? item : Object.assign({}, item, { value: String(item.value) });
      let { type } = item;
      if (type !== Scalar.Scalar.QUOTE_DOUBLE) {
        if (/[\x00-\x08\x0b-\x1f\x7f-\x9f\u{D800}-\u{DFFF}]/u.test(ss.value))
          type = Scalar.Scalar.QUOTE_DOUBLE;
      }
      const _stringify = (_type) => {
        switch (_type) {
          case Scalar.Scalar.BLOCK_FOLDED:
          case Scalar.Scalar.BLOCK_LITERAL:
            return implicitKey || inFlow ? quotedString(ss.value, ctx) : blockString(ss, ctx, onComment, onChompKeep);
          case Scalar.Scalar.QUOTE_DOUBLE:
            return doubleQuotedString(ss.value, ctx);
          case Scalar.Scalar.QUOTE_SINGLE:
            return singleQuotedString(ss.value, ctx);
          case Scalar.Scalar.PLAIN:
            return plainString(ss, ctx, onComment, onChompKeep);
          default:
            return null;
        }
      };
      let res = _stringify(type);
      if (res === null) {
        const { defaultKeyType, defaultStringType } = ctx.options;
        const t = implicitKey && defaultKeyType || defaultStringType;
        res = _stringify(t);
        if (res === null)
          throw new Error(`Unsupported default string type ${t}`);
      }
      return res;
    }
    exports.stringifyString = stringifyString;
  }
});

// ../../node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/stringify/stringify.js
var require_stringify = __commonJS({
  "../../node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/stringify/stringify.js"(exports) {
    "use strict";
    var anchors = require_anchors();
    var identity = require_identity();
    var stringifyComment = require_stringifyComment();
    var stringifyString = require_stringifyString();
    function createStringifyContext(doc, options) {
      const opt = Object.assign({
        blockQuote: true,
        commentString: stringifyComment.stringifyComment,
        defaultKeyType: null,
        defaultStringType: "PLAIN",
        directives: null,
        doubleQuotedAsJSON: false,
        doubleQuotedMinMultiLineLength: 40,
        falseStr: "false",
        flowCollectionPadding: true,
        indentSeq: true,
        lineWidth: 80,
        minContentWidth: 20,
        nullStr: "null",
        simpleKeys: false,
        singleQuote: null,
        trailingComma: false,
        trueStr: "true",
        verifyAliasOrder: true
      }, doc.schema.toStringOptions, options);
      let inFlow;
      switch (opt.collectionStyle) {
        case "block":
          inFlow = false;
          break;
        case "flow":
          inFlow = true;
          break;
        default:
          inFlow = null;
      }
      return {
        anchors: /* @__PURE__ */ new Set(),
        doc,
        flowCollectionPadding: opt.flowCollectionPadding ? " " : "",
        indent: "",
        indentStep: typeof opt.indent === "number" ? " ".repeat(opt.indent) : "  ",
        inFlow,
        options: opt
      };
    }
    function getTagObject(tags, item) {
      if (item.tag) {
        const match = tags.filter((t) => t.tag === item.tag);
        if (match.length > 0)
          return match.find((t) => t.format === item.format) ?? match[0];
      }
      let tagObj = void 0;
      let obj;
      if (identity.isScalar(item)) {
        obj = item.value;
        let match = tags.filter((t) => t.identify?.(obj));
        if (match.length > 1) {
          const testMatch = match.filter((t) => t.test);
          if (testMatch.length > 0)
            match = testMatch;
        }
        tagObj = match.find((t) => t.format === item.format) ?? match.find((t) => !t.format);
      } else {
        obj = item;
        tagObj = tags.find((t) => t.nodeClass && obj instanceof t.nodeClass);
      }
      if (!tagObj) {
        const name = obj?.constructor?.name ?? (obj === null ? "null" : typeof obj);
        throw new Error(`Tag not resolved for ${name} value`);
      }
      return tagObj;
    }
    function stringifyProps(node, tagObj, { anchors: anchors$1, doc }) {
      if (!doc.directives)
        return "";
      const props = [];
      const anchor = (identity.isScalar(node) || identity.isCollection(node)) && node.anchor;
      if (anchor && anchors.anchorIsValid(anchor)) {
        anchors$1.add(anchor);
        props.push(`&${anchor}`);
      }
      const tag = node.tag ?? (tagObj.default ? null : tagObj.tag);
      if (tag)
        props.push(doc.directives.tagString(tag));
      return props.join(" ");
    }
    function stringify(item, ctx, onComment, onChompKeep) {
      if (identity.isPair(item))
        return item.toString(ctx, onComment, onChompKeep);
      if (identity.isAlias(item)) {
        if (ctx.doc.directives)
          return item.toString(ctx);
        if (ctx.resolvedAliases?.has(item)) {
          throw new TypeError(`Cannot stringify circular structure without alias nodes`);
        } else {
          if (ctx.resolvedAliases)
            ctx.resolvedAliases.add(item);
          else
            ctx.resolvedAliases = /* @__PURE__ */ new Set([item]);
          item = item.resolve(ctx.doc);
        }
      }
      let tagObj = void 0;
      const node = identity.isNode(item) ? item : ctx.doc.createNode(item, { onTagObj: (o) => tagObj = o });
      tagObj ?? (tagObj = getTagObject(ctx.doc.schema.tags, node));
      const props = stringifyProps(node, tagObj, ctx);
      if (props.length > 0)
        ctx.indentAtStart = (ctx.indentAtStart ?? 0) + props.length + 1;
      const str3 = typeof tagObj.stringify === "function" ? tagObj.stringify(node, ctx, onComment, onChompKeep) : identity.isScalar(node) ? stringifyString.stringifyString(node, ctx, onComment, onChompKeep) : node.toString(ctx, onComment, onChompKeep);
      if (!props)
        return str3;
      return identity.isScalar(node) || str3[0] === "{" || str3[0] === "[" ? `${props} ${str3}` : `${props}
${ctx.indent}${str3}`;
    }
    exports.createStringifyContext = createStringifyContext;
    exports.stringify = stringify;
  }
});

// ../../node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/stringify/stringifyPair.js
var require_stringifyPair = __commonJS({
  "../../node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/stringify/stringifyPair.js"(exports) {
    "use strict";
    var identity = require_identity();
    var Scalar = require_Scalar();
    var stringify = require_stringify();
    var stringifyComment = require_stringifyComment();
    function stringifyPair({ key, value }, ctx, onComment, onChompKeep) {
      const { allNullValues, doc, indent, indentStep, options: { commentString, indentSeq, simpleKeys } } = ctx;
      let keyComment = identity.isNode(key) && key.comment || null;
      if (simpleKeys) {
        if (keyComment) {
          throw new Error("With simple keys, key nodes cannot have comments");
        }
        if (identity.isCollection(key) || !identity.isNode(key) && typeof key === "object") {
          const msg = "With simple keys, collection cannot be used as a key value";
          throw new Error(msg);
        }
      }
      let explicitKey = !simpleKeys && (!key || keyComment && value == null && !ctx.inFlow || identity.isCollection(key) || (identity.isScalar(key) ? key.type === Scalar.Scalar.BLOCK_FOLDED || key.type === Scalar.Scalar.BLOCK_LITERAL : typeof key === "object"));
      ctx = Object.assign({}, ctx, {
        allNullValues: false,
        implicitKey: !explicitKey && (simpleKeys || !allNullValues),
        indent: indent + indentStep
      });
      let keyCommentDone = false;
      let chompKeep = false;
      let str3 = stringify.stringify(key, ctx, () => keyCommentDone = true, () => chompKeep = true);
      if (!explicitKey && !ctx.inFlow && str3.length > 1024) {
        if (simpleKeys)
          throw new Error("With simple keys, single line scalar must not span more than 1024 characters");
        explicitKey = true;
      }
      if (ctx.inFlow) {
        if (allNullValues || value == null) {
          if (keyCommentDone && onComment)
            onComment();
          return str3 === "" ? "?" : explicitKey ? `? ${str3}` : str3;
        }
      } else if (allNullValues && !simpleKeys || value == null && explicitKey) {
        str3 = `? ${str3}`;
        if (keyComment && !keyCommentDone) {
          str3 += stringifyComment.lineComment(str3, ctx.indent, commentString(keyComment));
        } else if (chompKeep && onChompKeep)
          onChompKeep();
        return str3;
      }
      if (keyCommentDone)
        keyComment = null;
      if (explicitKey) {
        if (keyComment)
          str3 += stringifyComment.lineComment(str3, ctx.indent, commentString(keyComment));
        str3 = `? ${str3}
${indent}:`;
      } else {
        str3 = `${str3}:`;
        if (keyComment)
          str3 += stringifyComment.lineComment(str3, ctx.indent, commentString(keyComment));
      }
      let vsb, vcb, valueComment;
      if (identity.isNode(value)) {
        vsb = !!value.spaceBefore;
        vcb = value.commentBefore;
        valueComment = value.comment;
      } else {
        vsb = false;
        vcb = null;
        valueComment = null;
        if (value && typeof value === "object")
          value = doc.createNode(value);
      }
      ctx.implicitKey = false;
      if (!explicitKey && !keyComment && identity.isScalar(value))
        ctx.indentAtStart = str3.length + 1;
      chompKeep = false;
      if (!indentSeq && indentStep.length >= 2 && !ctx.inFlow && !explicitKey && identity.isSeq(value) && !value.flow && !value.tag && !value.anchor) {
        ctx.indent = ctx.indent.substring(2);
      }
      let valueCommentDone = false;
      const valueStr = stringify.stringify(value, ctx, () => valueCommentDone = true, () => chompKeep = true);
      let ws = " ";
      if (keyComment || vsb || vcb) {
        ws = vsb ? "\n" : "";
        if (vcb) {
          const cs = commentString(vcb);
          ws += `
${stringifyComment.indentComment(cs, ctx.indent)}`;
        }
        if (valueStr === "" && !ctx.inFlow) {
          if (ws === "\n" && valueComment)
            ws = "\n\n";
        } else {
          ws += `
${ctx.indent}`;
        }
      } else if (!explicitKey && identity.isCollection(value)) {
        const vs0 = valueStr[0];
        const nl0 = valueStr.indexOf("\n");
        const hasNewline = nl0 !== -1;
        const flow = ctx.inFlow ?? value.flow ?? value.items.length === 0;
        if (hasNewline || !flow) {
          let hasPropsLine = false;
          if (hasNewline && (vs0 === "&" || vs0 === "!")) {
            let sp0 = valueStr.indexOf(" ");
            if (vs0 === "&" && sp0 !== -1 && sp0 < nl0 && valueStr[sp0 + 1] === "!") {
              sp0 = valueStr.indexOf(" ", sp0 + 1);
            }
            if (sp0 === -1 || nl0 < sp0)
              hasPropsLine = true;
          }
          if (!hasPropsLine)
            ws = `
${ctx.indent}`;
        }
      } else if (valueStr === "" || valueStr[0] === "\n") {
        ws = "";
      }
      str3 += ws + valueStr;
      if (ctx.inFlow) {
        if (valueCommentDone && onComment)
          onComment();
      } else if (valueComment && !valueCommentDone) {
        str3 += stringifyComment.lineComment(str3, ctx.indent, commentString(valueComment));
      } else if (chompKeep && onChompKeep) {
        onChompKeep();
      }
      return str3;
    }
    exports.stringifyPair = stringifyPair;
  }
});

// ../../node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/log.js
var require_log = __commonJS({
  "../../node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/log.js"(exports) {
    "use strict";
    var node_process = __require("process");
    function debug(logLevel, ...messages) {
      if (logLevel === "debug")
        console.log(...messages);
    }
    function warn(logLevel, warning) {
      if (logLevel === "debug" || logLevel === "warn") {
        if (typeof node_process.emitWarning === "function")
          node_process.emitWarning(warning);
        else
          console.warn(warning);
      }
    }
    exports.debug = debug;
    exports.warn = warn;
  }
});

// ../../node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/schema/yaml-1.1/merge.js
var require_merge = __commonJS({
  "../../node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/schema/yaml-1.1/merge.js"(exports) {
    "use strict";
    var identity = require_identity();
    var Scalar = require_Scalar();
    var MERGE_KEY = "<<";
    var merge = {
      identify: (value) => value === MERGE_KEY || typeof value === "symbol" && value.description === MERGE_KEY,
      default: "key",
      tag: "tag:yaml.org,2002:merge",
      test: /^<<$/,
      resolve: () => Object.assign(new Scalar.Scalar(Symbol(MERGE_KEY)), {
        addToJSMap: addMergeToJSMap
      }),
      stringify: () => MERGE_KEY
    };
    var isMergeKey = (ctx, key) => (merge.identify(key) || identity.isScalar(key) && (!key.type || key.type === Scalar.Scalar.PLAIN) && merge.identify(key.value)) && ctx?.doc.schema.tags.some((tag) => tag.tag === merge.tag && tag.default);
    function addMergeToJSMap(ctx, map, value) {
      const source = resolveAliasValue(ctx, value);
      if (identity.isSeq(source))
        for (const it of source.items)
          mergeValue(ctx, map, it);
      else if (Array.isArray(source))
        for (const it of source)
          mergeValue(ctx, map, it);
      else
        mergeValue(ctx, map, source);
    }
    function mergeValue(ctx, map, value) {
      const source = resolveAliasValue(ctx, value);
      if (!identity.isMap(source))
        throw new Error("Merge sources must be maps or map aliases");
      const srcMap = source.toJSON(null, ctx, Map);
      for (const [key, value2] of srcMap) {
        if (map instanceof Map) {
          if (!map.has(key))
            map.set(key, value2);
        } else if (map instanceof Set) {
          map.add(key);
        } else if (!Object.prototype.hasOwnProperty.call(map, key)) {
          Object.defineProperty(map, key, {
            value: value2,
            writable: true,
            enumerable: true,
            configurable: true
          });
        }
      }
      return map;
    }
    function resolveAliasValue(ctx, value) {
      return ctx && identity.isAlias(value) ? value.resolve(ctx.doc, ctx) : value;
    }
    exports.addMergeToJSMap = addMergeToJSMap;
    exports.isMergeKey = isMergeKey;
    exports.merge = merge;
  }
});

// ../../node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/nodes/addPairToJSMap.js
var require_addPairToJSMap = __commonJS({
  "../../node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/nodes/addPairToJSMap.js"(exports) {
    "use strict";
    var log = require_log();
    var merge = require_merge();
    var stringify = require_stringify();
    var identity = require_identity();
    var toJS = require_toJS();
    function addPairToJSMap(ctx, map, { key, value }) {
      if (identity.isNode(key) && key.addToJSMap)
        key.addToJSMap(ctx, map, value);
      else if (merge.isMergeKey(ctx, key))
        merge.addMergeToJSMap(ctx, map, value);
      else {
        const jsKey = toJS.toJS(key, "", ctx);
        if (map instanceof Map) {
          map.set(jsKey, toJS.toJS(value, jsKey, ctx));
        } else if (map instanceof Set) {
          map.add(jsKey);
        } else {
          const stringKey = stringifyKey(key, jsKey, ctx);
          const jsValue = toJS.toJS(value, stringKey, ctx);
          if (stringKey in map)
            Object.defineProperty(map, stringKey, {
              value: jsValue,
              writable: true,
              enumerable: true,
              configurable: true
            });
          else
            map[stringKey] = jsValue;
        }
      }
      return map;
    }
    function stringifyKey(key, jsKey, ctx) {
      if (jsKey === null)
        return "";
      if (typeof jsKey !== "object")
        return String(jsKey);
      if (identity.isNode(key) && ctx?.doc) {
        const strCtx = stringify.createStringifyContext(ctx.doc, {});
        strCtx.anchors = /* @__PURE__ */ new Set();
        for (const node of ctx.anchors.keys())
          strCtx.anchors.add(node.anchor);
        strCtx.inFlow = true;
        strCtx.inStringifyKey = true;
        const strKey = key.toString(strCtx);
        if (!ctx.mapKeyWarned) {
          let jsonStr = JSON.stringify(strKey);
          if (jsonStr.length > 40)
            jsonStr = jsonStr.substring(0, 36) + '..."';
          log.warn(ctx.doc.options.logLevel, `Keys with collection values will be stringified due to JS Object restrictions: ${jsonStr}. Set mapAsMap: true to use object keys.`);
          ctx.mapKeyWarned = true;
        }
        return strKey;
      }
      return JSON.stringify(jsKey);
    }
    exports.addPairToJSMap = addPairToJSMap;
  }
});

// ../../node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/nodes/Pair.js
var require_Pair = __commonJS({
  "../../node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/nodes/Pair.js"(exports) {
    "use strict";
    var createNode = require_createNode();
    var stringifyPair = require_stringifyPair();
    var addPairToJSMap = require_addPairToJSMap();
    var identity = require_identity();
    function createPair(key, value, ctx) {
      const k = createNode.createNode(key, void 0, ctx);
      const v = createNode.createNode(value, void 0, ctx);
      return new Pair(k, v);
    }
    var Pair = class _Pair {
      constructor(key, value = null) {
        Object.defineProperty(this, identity.NODE_TYPE, { value: identity.PAIR });
        this.key = key;
        this.value = value;
      }
      clone(schema) {
        let { key, value } = this;
        if (identity.isNode(key))
          key = key.clone(schema);
        if (identity.isNode(value))
          value = value.clone(schema);
        return new _Pair(key, value);
      }
      toJSON(_, ctx) {
        const pair = ctx?.mapAsMap ? /* @__PURE__ */ new Map() : {};
        return addPairToJSMap.addPairToJSMap(ctx, pair, this);
      }
      toString(ctx, onComment, onChompKeep) {
        return ctx?.doc ? stringifyPair.stringifyPair(this, ctx, onComment, onChompKeep) : JSON.stringify(this);
      }
    };
    exports.Pair = Pair;
    exports.createPair = createPair;
  }
});

// ../../node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/stringify/stringifyCollection.js
var require_stringifyCollection = __commonJS({
  "../../node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/stringify/stringifyCollection.js"(exports) {
    "use strict";
    var identity = require_identity();
    var stringify = require_stringify();
    var stringifyComment = require_stringifyComment();
    function stringifyCollection(collection, ctx, options) {
      const flow = ctx.inFlow ?? collection.flow;
      const stringify2 = flow ? stringifyFlowCollection : stringifyBlockCollection;
      return stringify2(collection, ctx, options);
    }
    function stringifyBlockCollection({ comment, items }, ctx, { blockItemPrefix, flowChars, itemIndent, onChompKeep, onComment }) {
      const { indent, options: { commentString } } = ctx;
      const itemCtx = Object.assign({}, ctx, { indent: itemIndent, type: null });
      let chompKeep = false;
      const lines = [];
      for (let i = 0; i < items.length; ++i) {
        const item = items[i];
        let comment2 = null;
        if (identity.isNode(item)) {
          if (!chompKeep && item.spaceBefore)
            lines.push("");
          addCommentBefore(ctx, lines, item.commentBefore, chompKeep);
          if (item.comment)
            comment2 = item.comment;
        } else if (identity.isPair(item)) {
          const ik = identity.isNode(item.key) ? item.key : null;
          if (ik) {
            if (!chompKeep && ik.spaceBefore)
              lines.push("");
            addCommentBefore(ctx, lines, ik.commentBefore, chompKeep);
          }
        }
        chompKeep = false;
        let str4 = stringify.stringify(item, itemCtx, () => comment2 = null, () => chompKeep = true);
        if (comment2)
          str4 += stringifyComment.lineComment(str4, itemIndent, commentString(comment2));
        if (chompKeep && comment2)
          chompKeep = false;
        lines.push(blockItemPrefix + str4);
      }
      let str3;
      if (lines.length === 0) {
        str3 = flowChars.start + flowChars.end;
      } else {
        str3 = lines[0];
        for (let i = 1; i < lines.length; ++i) {
          const line = lines[i];
          str3 += line ? `
${indent}${line}` : "\n";
        }
      }
      if (comment) {
        str3 += "\n" + stringifyComment.indentComment(commentString(comment), indent);
        if (onComment)
          onComment();
      } else if (chompKeep && onChompKeep)
        onChompKeep();
      return str3;
    }
    function stringifyFlowCollection({ items }, ctx, { flowChars, itemIndent }) {
      const { indent, indentStep, flowCollectionPadding: fcPadding, options: { commentString } } = ctx;
      itemIndent += indentStep;
      const itemCtx = Object.assign({}, ctx, {
        indent: itemIndent,
        inFlow: true,
        type: null
      });
      let reqNewline = false;
      let linesAtValue = 0;
      const lines = [];
      for (let i = 0; i < items.length; ++i) {
        const item = items[i];
        let comment = null;
        if (identity.isNode(item)) {
          if (item.spaceBefore)
            lines.push("");
          addCommentBefore(ctx, lines, item.commentBefore, false);
          if (item.comment)
            comment = item.comment;
        } else if (identity.isPair(item)) {
          const ik = identity.isNode(item.key) ? item.key : null;
          if (ik) {
            if (ik.spaceBefore)
              lines.push("");
            addCommentBefore(ctx, lines, ik.commentBefore, false);
            if (ik.comment)
              reqNewline = true;
          }
          const iv = identity.isNode(item.value) ? item.value : null;
          if (iv) {
            if (iv.comment)
              comment = iv.comment;
            if (iv.commentBefore)
              reqNewline = true;
          } else if (item.value == null && ik?.comment) {
            comment = ik.comment;
          }
        }
        if (comment)
          reqNewline = true;
        let str3 = stringify.stringify(item, itemCtx, () => comment = null);
        reqNewline || (reqNewline = lines.length > linesAtValue || str3.includes("\n"));
        if (i < items.length - 1) {
          str3 += ",";
        } else if (ctx.options.trailingComma) {
          if (ctx.options.lineWidth > 0) {
            reqNewline || (reqNewline = lines.reduce((sum, line) => sum + line.length + 2, 2) + (str3.length + 2) > ctx.options.lineWidth);
          }
          if (reqNewline) {
            str3 += ",";
          }
        }
        if (comment)
          str3 += stringifyComment.lineComment(str3, itemIndent, commentString(comment));
        lines.push(str3);
        linesAtValue = lines.length;
      }
      const { start, end } = flowChars;
      if (lines.length === 0) {
        return start + end;
      } else {
        if (!reqNewline) {
          const len = lines.reduce((sum, line) => sum + line.length + 2, 2);
          reqNewline = ctx.options.lineWidth > 0 && len > ctx.options.lineWidth;
        }
        if (reqNewline) {
          let str3 = start;
          for (const line of lines)
            str3 += line ? `
${indentStep}${indent}${line}` : "\n";
          return `${str3}
${indent}${end}`;
        } else {
          return `${start}${fcPadding}${lines.join(" ")}${fcPadding}${end}`;
        }
      }
    }
    function addCommentBefore({ indent, options: { commentString } }, lines, comment, chompKeep) {
      if (comment && chompKeep)
        comment = comment.replace(/^\n+/, "");
      if (comment) {
        const ic = stringifyComment.indentComment(commentString(comment), indent);
        lines.push(ic.trimStart());
      }
    }
    exports.stringifyCollection = stringifyCollection;
  }
});

// ../../node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/nodes/YAMLMap.js
var require_YAMLMap = __commonJS({
  "../../node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/nodes/YAMLMap.js"(exports) {
    "use strict";
    var stringifyCollection = require_stringifyCollection();
    var addPairToJSMap = require_addPairToJSMap();
    var Collection = require_Collection();
    var identity = require_identity();
    var Pair = require_Pair();
    var Scalar = require_Scalar();
    function findPair(items, key) {
      const k = identity.isScalar(key) ? key.value : key;
      for (const it of items) {
        if (identity.isPair(it)) {
          if (it.key === key || it.key === k)
            return it;
          if (identity.isScalar(it.key) && it.key.value === k)
            return it;
        }
      }
      return void 0;
    }
    var YAMLMap = class extends Collection.Collection {
      static get tagName() {
        return "tag:yaml.org,2002:map";
      }
      constructor(schema) {
        super(identity.MAP, schema);
        this.items = [];
      }
      /**
       * A generic collection parsing method that can be extended
       * to other node classes that inherit from YAMLMap
       */
      static from(schema, obj, ctx) {
        const { keepUndefined, replacer } = ctx;
        const map = new this(schema);
        const add = (key, value) => {
          if (typeof replacer === "function")
            value = replacer.call(obj, key, value);
          else if (Array.isArray(replacer) && !replacer.includes(key))
            return;
          if (value !== void 0 || keepUndefined)
            map.items.push(Pair.createPair(key, value, ctx));
        };
        if (obj instanceof Map) {
          for (const [key, value] of obj)
            add(key, value);
        } else if (obj && typeof obj === "object") {
          for (const key of Object.keys(obj))
            add(key, obj[key]);
        }
        if (typeof schema.sortMapEntries === "function") {
          map.items.sort(schema.sortMapEntries);
        }
        return map;
      }
      /**
       * Adds a value to the collection.
       *
       * @param overwrite - If not set `true`, using a key that is already in the
       *   collection will throw. Otherwise, overwrites the previous value.
       */
      add(pair, overwrite) {
        let _pair;
        if (identity.isPair(pair))
          _pair = pair;
        else if (!pair || typeof pair !== "object" || !("key" in pair)) {
          _pair = new Pair.Pair(pair, pair?.value);
        } else
          _pair = new Pair.Pair(pair.key, pair.value);
        const prev = findPair(this.items, _pair.key);
        const sortEntries = this.schema?.sortMapEntries;
        if (prev) {
          if (!overwrite)
            throw new Error(`Key ${_pair.key} already set`);
          if (identity.isScalar(prev.value) && Scalar.isScalarValue(_pair.value))
            prev.value.value = _pair.value;
          else
            prev.value = _pair.value;
        } else if (sortEntries) {
          const i = this.items.findIndex((item) => sortEntries(_pair, item) < 0);
          if (i === -1)
            this.items.push(_pair);
          else
            this.items.splice(i, 0, _pair);
        } else {
          this.items.push(_pair);
        }
      }
      delete(key) {
        const it = findPair(this.items, key);
        if (!it)
          return false;
        const del = this.items.splice(this.items.indexOf(it), 1);
        return del.length > 0;
      }
      get(key, keepScalar) {
        const it = findPair(this.items, key);
        const node = it?.value;
        return (!keepScalar && identity.isScalar(node) ? node.value : node) ?? void 0;
      }
      has(key) {
        return !!findPair(this.items, key);
      }
      set(key, value) {
        this.add(new Pair.Pair(key, value), true);
      }
      /**
       * @param ctx - Conversion context, originally set in Document#toJS()
       * @param {Class} Type - If set, forces the returned collection type
       * @returns Instance of Type, Map, or Object
       */
      toJSON(_, ctx, Type) {
        const map = Type ? new Type() : ctx?.mapAsMap ? /* @__PURE__ */ new Map() : {};
        if (ctx?.onCreate)
          ctx.onCreate(map);
        for (const item of this.items)
          addPairToJSMap.addPairToJSMap(ctx, map, item);
        return map;
      }
      toString(ctx, onComment, onChompKeep) {
        if (!ctx)
          return JSON.stringify(this);
        for (const item of this.items) {
          if (!identity.isPair(item))
            throw new Error(`Map items must all be pairs; found ${JSON.stringify(item)} instead`);
        }
        if (!ctx.allNullValues && this.hasAllNullValues(false))
          ctx = Object.assign({}, ctx, { allNullValues: true });
        return stringifyCollection.stringifyCollection(this, ctx, {
          blockItemPrefix: "",
          flowChars: { start: "{", end: "}" },
          itemIndent: ctx.indent || "",
          onChompKeep,
          onComment
        });
      }
    };
    exports.YAMLMap = YAMLMap;
    exports.findPair = findPair;
  }
});

// ../../node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/schema/common/map.js
var require_map = __commonJS({
  "../../node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/schema/common/map.js"(exports) {
    "use strict";
    var identity = require_identity();
    var YAMLMap = require_YAMLMap();
    var map = {
      collection: "map",
      default: true,
      nodeClass: YAMLMap.YAMLMap,
      tag: "tag:yaml.org,2002:map",
      resolve(map2, onError) {
        if (!identity.isMap(map2))
          onError("Expected a mapping for this tag");
        return map2;
      },
      createNode: (schema, obj, ctx) => YAMLMap.YAMLMap.from(schema, obj, ctx)
    };
    exports.map = map;
  }
});

// ../../node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/nodes/YAMLSeq.js
var require_YAMLSeq = __commonJS({
  "../../node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/nodes/YAMLSeq.js"(exports) {
    "use strict";
    var createNode = require_createNode();
    var stringifyCollection = require_stringifyCollection();
    var Collection = require_Collection();
    var identity = require_identity();
    var Scalar = require_Scalar();
    var toJS = require_toJS();
    var YAMLSeq2 = class extends Collection.Collection {
      static get tagName() {
        return "tag:yaml.org,2002:seq";
      }
      constructor(schema) {
        super(identity.SEQ, schema);
        this.items = [];
      }
      add(value) {
        this.items.push(value);
      }
      /**
       * Removes a value from the collection.
       *
       * `key` must contain a representation of an integer for this to succeed.
       * It may be wrapped in a `Scalar`.
       *
       * @returns `true` if the item was found and removed.
       */
      delete(key) {
        const idx = asItemIndex(key);
        if (typeof idx !== "number")
          return false;
        const del = this.items.splice(idx, 1);
        return del.length > 0;
      }
      get(key, keepScalar) {
        const idx = asItemIndex(key);
        if (typeof idx !== "number")
          return void 0;
        const it = this.items[idx];
        return !keepScalar && identity.isScalar(it) ? it.value : it;
      }
      /**
       * Checks if the collection includes a value with the key `key`.
       *
       * `key` must contain a representation of an integer for this to succeed.
       * It may be wrapped in a `Scalar`.
       */
      has(key) {
        const idx = asItemIndex(key);
        return typeof idx === "number" && idx < this.items.length;
      }
      /**
       * Sets a value in this collection. For `!!set`, `value` needs to be a
       * boolean to add/remove the item from the set.
       *
       * If `key` does not contain a representation of an integer, this will throw.
       * It may be wrapped in a `Scalar`.
       */
      set(key, value) {
        const idx = asItemIndex(key);
        if (typeof idx !== "number")
          throw new Error(`Expected a valid index, not ${key}.`);
        const prev = this.items[idx];
        if (identity.isScalar(prev) && Scalar.isScalarValue(value))
          prev.value = value;
        else
          this.items[idx] = value;
      }
      toJSON(_, ctx) {
        const seq = [];
        if (ctx?.onCreate)
          ctx.onCreate(seq);
        let i = 0;
        for (const item of this.items)
          seq.push(toJS.toJS(item, String(i++), ctx));
        return seq;
      }
      toString(ctx, onComment, onChompKeep) {
        if (!ctx)
          return JSON.stringify(this);
        return stringifyCollection.stringifyCollection(this, ctx, {
          blockItemPrefix: "- ",
          flowChars: { start: "[", end: "]" },
          itemIndent: (ctx.indent || "") + "  ",
          onChompKeep,
          onComment
        });
      }
      static from(schema, obj, ctx) {
        const { replacer } = ctx;
        const seq = new this(schema);
        if (obj && Symbol.iterator in Object(obj)) {
          let i = 0;
          for (let it of obj) {
            if (typeof replacer === "function") {
              const key = obj instanceof Set ? it : String(i++);
              it = replacer.call(obj, key, it);
            }
            seq.items.push(createNode.createNode(it, void 0, ctx));
          }
        }
        return seq;
      }
    };
    function asItemIndex(key) {
      let idx = identity.isScalar(key) ? key.value : key;
      if (idx && typeof idx === "string")
        idx = Number(idx);
      return typeof idx === "number" && Number.isInteger(idx) && idx >= 0 ? idx : null;
    }
    exports.YAMLSeq = YAMLSeq2;
  }
});

// ../../node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/schema/common/seq.js
var require_seq = __commonJS({
  "../../node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/schema/common/seq.js"(exports) {
    "use strict";
    var identity = require_identity();
    var YAMLSeq2 = require_YAMLSeq();
    var seq = {
      collection: "seq",
      default: true,
      nodeClass: YAMLSeq2.YAMLSeq,
      tag: "tag:yaml.org,2002:seq",
      resolve(seq2, onError) {
        if (!identity.isSeq(seq2))
          onError("Expected a sequence for this tag");
        return seq2;
      },
      createNode: (schema, obj, ctx) => YAMLSeq2.YAMLSeq.from(schema, obj, ctx)
    };
    exports.seq = seq;
  }
});

// ../../node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/schema/common/string.js
var require_string = __commonJS({
  "../../node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/schema/common/string.js"(exports) {
    "use strict";
    var stringifyString = require_stringifyString();
    var string = {
      identify: (value) => typeof value === "string",
      default: true,
      tag: "tag:yaml.org,2002:str",
      resolve: (str3) => str3,
      stringify(item, ctx, onComment, onChompKeep) {
        ctx = Object.assign({ actualString: true }, ctx);
        return stringifyString.stringifyString(item, ctx, onComment, onChompKeep);
      }
    };
    exports.string = string;
  }
});

// ../../node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/schema/common/null.js
var require_null = __commonJS({
  "../../node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/schema/common/null.js"(exports) {
    "use strict";
    var Scalar = require_Scalar();
    var nullTag = {
      identify: (value) => value == null,
      createNode: () => new Scalar.Scalar(null),
      default: true,
      tag: "tag:yaml.org,2002:null",
      test: /^(?:~|[Nn]ull|NULL)?$/,
      resolve: () => new Scalar.Scalar(null),
      stringify: ({ source }, ctx) => typeof source === "string" && nullTag.test.test(source) ? source : ctx.options.nullStr
    };
    exports.nullTag = nullTag;
  }
});

// ../../node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/schema/core/bool.js
var require_bool = __commonJS({
  "../../node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/schema/core/bool.js"(exports) {
    "use strict";
    var Scalar = require_Scalar();
    var boolTag = {
      identify: (value) => typeof value === "boolean",
      default: true,
      tag: "tag:yaml.org,2002:bool",
      test: /^(?:[Tt]rue|TRUE|[Ff]alse|FALSE)$/,
      resolve: (str3) => new Scalar.Scalar(str3[0] === "t" || str3[0] === "T"),
      stringify({ source, value }, ctx) {
        if (source && boolTag.test.test(source)) {
          const sv = source[0] === "t" || source[0] === "T";
          if (value === sv)
            return source;
        }
        return value ? ctx.options.trueStr : ctx.options.falseStr;
      }
    };
    exports.boolTag = boolTag;
  }
});

// ../../node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/stringify/stringifyNumber.js
var require_stringifyNumber = __commonJS({
  "../../node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/stringify/stringifyNumber.js"(exports) {
    "use strict";
    function stringifyNumber({ format, minFractionDigits, tag, value }) {
      if (typeof value === "bigint")
        return String(value);
      const num2 = typeof value === "number" ? value : Number(value);
      if (!isFinite(num2))
        return isNaN(num2) ? ".nan" : num2 < 0 ? "-.inf" : ".inf";
      let n = Object.is(value, -0) ? "-0" : JSON.stringify(value);
      if (!format && minFractionDigits && (!tag || tag === "tag:yaml.org,2002:float") && /^-?\d/.test(n) && !n.includes("e")) {
        let i = n.indexOf(".");
        if (i < 0) {
          i = n.length;
          n += ".";
        }
        let d = minFractionDigits - (n.length - i - 1);
        while (d-- > 0)
          n += "0";
      }
      return n;
    }
    exports.stringifyNumber = stringifyNumber;
  }
});

// ../../node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/schema/core/float.js
var require_float = __commonJS({
  "../../node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/schema/core/float.js"(exports) {
    "use strict";
    var Scalar = require_Scalar();
    var stringifyNumber = require_stringifyNumber();
    var floatNaN = {
      identify: (value) => typeof value === "number",
      default: true,
      tag: "tag:yaml.org,2002:float",
      test: /^(?:[-+]?\.(?:inf|Inf|INF)|\.nan|\.NaN|\.NAN)$/,
      resolve: (str3) => str3.slice(-3).toLowerCase() === "nan" ? NaN : str3[0] === "-" ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY,
      stringify: stringifyNumber.stringifyNumber
    };
    var floatExp = {
      identify: (value) => typeof value === "number",
      default: true,
      tag: "tag:yaml.org,2002:float",
      format: "EXP",
      test: /^[-+]?(?:\.[0-9]+|[0-9]+(?:\.[0-9]*)?)[eE][-+]?[0-9]+$/,
      resolve: (str3) => parseFloat(str3),
      stringify(node) {
        const num2 = Number(node.value);
        return isFinite(num2) ? num2.toExponential() : stringifyNumber.stringifyNumber(node);
      }
    };
    var float = {
      identify: (value) => typeof value === "number",
      default: true,
      tag: "tag:yaml.org,2002:float",
      test: /^[-+]?(?:\.[0-9]+|[0-9]+\.[0-9]*)$/,
      resolve(str3) {
        const node = new Scalar.Scalar(parseFloat(str3));
        const dot = str3.indexOf(".");
        if (dot !== -1 && str3[str3.length - 1] === "0")
          node.minFractionDigits = str3.length - dot - 1;
        return node;
      },
      stringify: stringifyNumber.stringifyNumber
    };
    exports.float = float;
    exports.floatExp = floatExp;
    exports.floatNaN = floatNaN;
  }
});

// ../../node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/schema/core/int.js
var require_int = __commonJS({
  "../../node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/schema/core/int.js"(exports) {
    "use strict";
    var stringifyNumber = require_stringifyNumber();
    var intIdentify = (value) => typeof value === "bigint" || Number.isInteger(value);
    var intResolve = (str3, offset, radix, { intAsBigInt }) => intAsBigInt ? BigInt(str3) : parseInt(str3.substring(offset), radix);
    function intStringify(node, radix, prefix) {
      const { value } = node;
      if (intIdentify(value) && value >= 0)
        return prefix + value.toString(radix);
      return stringifyNumber.stringifyNumber(node);
    }
    var intOct = {
      identify: (value) => intIdentify(value) && value >= 0,
      default: true,
      tag: "tag:yaml.org,2002:int",
      format: "OCT",
      test: /^0o[0-7]+$/,
      resolve: (str3, _onError, opt) => intResolve(str3, 2, 8, opt),
      stringify: (node) => intStringify(node, 8, "0o")
    };
    var int = {
      identify: intIdentify,
      default: true,
      tag: "tag:yaml.org,2002:int",
      test: /^[-+]?[0-9]+$/,
      resolve: (str3, _onError, opt) => intResolve(str3, 0, 10, opt),
      stringify: stringifyNumber.stringifyNumber
    };
    var intHex = {
      identify: (value) => intIdentify(value) && value >= 0,
      default: true,
      tag: "tag:yaml.org,2002:int",
      format: "HEX",
      test: /^0x[0-9a-fA-F]+$/,
      resolve: (str3, _onError, opt) => intResolve(str3, 2, 16, opt),
      stringify: (node) => intStringify(node, 16, "0x")
    };
    exports.int = int;
    exports.intHex = intHex;
    exports.intOct = intOct;
  }
});

// ../../node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/schema/core/schema.js
var require_schema = __commonJS({
  "../../node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/schema/core/schema.js"(exports) {
    "use strict";
    var map = require_map();
    var _null = require_null();
    var seq = require_seq();
    var string = require_string();
    var bool = require_bool();
    var float = require_float();
    var int = require_int();
    var schema = [
      map.map,
      seq.seq,
      string.string,
      _null.nullTag,
      bool.boolTag,
      int.intOct,
      int.int,
      int.intHex,
      float.floatNaN,
      float.floatExp,
      float.float
    ];
    exports.schema = schema;
  }
});

// ../../node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/schema/json/schema.js
var require_schema2 = __commonJS({
  "../../node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/schema/json/schema.js"(exports) {
    "use strict";
    var Scalar = require_Scalar();
    var map = require_map();
    var seq = require_seq();
    function intIdentify(value) {
      return typeof value === "bigint" || Number.isInteger(value);
    }
    var stringifyJSON = ({ value }) => JSON.stringify(value);
    var jsonScalars = [
      {
        identify: (value) => typeof value === "string",
        default: true,
        tag: "tag:yaml.org,2002:str",
        resolve: (str3) => str3,
        stringify: stringifyJSON
      },
      {
        identify: (value) => value == null,
        createNode: () => new Scalar.Scalar(null),
        default: true,
        tag: "tag:yaml.org,2002:null",
        test: /^null$/,
        resolve: () => null,
        stringify: stringifyJSON
      },
      {
        identify: (value) => typeof value === "boolean",
        default: true,
        tag: "tag:yaml.org,2002:bool",
        test: /^true$|^false$/,
        resolve: (str3) => str3 === "true",
        stringify: stringifyJSON
      },
      {
        identify: intIdentify,
        default: true,
        tag: "tag:yaml.org,2002:int",
        test: /^-?(?:0|[1-9][0-9]*)$/,
        resolve: (str3, _onError, { intAsBigInt }) => intAsBigInt ? BigInt(str3) : parseInt(str3, 10),
        stringify: ({ value }) => intIdentify(value) ? value.toString() : JSON.stringify(value)
      },
      {
        identify: (value) => typeof value === "number",
        default: true,
        tag: "tag:yaml.org,2002:float",
        test: /^-?(?:0|[1-9][0-9]*)(?:\.[0-9]*)?(?:[eE][-+]?[0-9]+)?$/,
        resolve: (str3) => parseFloat(str3),
        stringify: stringifyJSON
      }
    ];
    var jsonError = {
      default: true,
      tag: "",
      test: /^/,
      resolve(str3, onError) {
        onError(`Unresolved plain scalar ${JSON.stringify(str3)}`);
        return str3;
      }
    };
    var schema = [map.map, seq.seq].concat(jsonScalars, jsonError);
    exports.schema = schema;
  }
});

// ../../node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/schema/yaml-1.1/binary.js
var require_binary = __commonJS({
  "../../node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/schema/yaml-1.1/binary.js"(exports) {
    "use strict";
    var node_buffer = __require("buffer");
    var Scalar = require_Scalar();
    var stringifyString = require_stringifyString();
    var binary = {
      identify: (value) => value instanceof Uint8Array,
      // Buffer inherits from Uint8Array
      default: false,
      tag: "tag:yaml.org,2002:binary",
      /**
       * Returns a Buffer in node and an Uint8Array in browsers
       *
       * To use the resulting buffer as an image, you'll want to do something like:
       *
       *   const blob = new Blob([buffer], { type: 'image/jpeg' })
       *   document.querySelector('#photo').src = URL.createObjectURL(blob)
       */
      resolve(src, onError) {
        if (typeof node_buffer.Buffer === "function") {
          return node_buffer.Buffer.from(src, "base64");
        } else if (typeof atob === "function") {
          const str3 = atob(src.replace(/[\n\r]/g, ""));
          const buffer = new Uint8Array(str3.length);
          for (let i = 0; i < str3.length; ++i)
            buffer[i] = str3.charCodeAt(i);
          return buffer;
        } else {
          onError("This environment does not support reading binary tags; either Buffer or atob is required");
          return src;
        }
      },
      stringify({ comment, type, value }, ctx, onComment, onChompKeep) {
        if (!value)
          return "";
        const buf = value;
        let str3;
        if (typeof node_buffer.Buffer === "function") {
          str3 = buf instanceof node_buffer.Buffer ? buf.toString("base64") : node_buffer.Buffer.from(buf.buffer).toString("base64");
        } else if (typeof btoa === "function") {
          let s = "";
          for (let i = 0; i < buf.length; ++i)
            s += String.fromCharCode(buf[i]);
          str3 = btoa(s);
        } else {
          throw new Error("This environment does not support writing binary tags; either Buffer or btoa is required");
        }
        type ?? (type = Scalar.Scalar.BLOCK_LITERAL);
        if (type !== Scalar.Scalar.QUOTE_DOUBLE) {
          const lineWidth = Math.max(ctx.options.lineWidth - ctx.indent.length, ctx.options.minContentWidth);
          const n = Math.ceil(str3.length / lineWidth);
          const lines = new Array(n);
          for (let i = 0, o = 0; i < n; ++i, o += lineWidth) {
            lines[i] = str3.substr(o, lineWidth);
          }
          str3 = lines.join(type === Scalar.Scalar.BLOCK_LITERAL ? "\n" : " ");
        }
        return stringifyString.stringifyString({ comment, type, value: str3 }, ctx, onComment, onChompKeep);
      }
    };
    exports.binary = binary;
  }
});

// ../../node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/schema/yaml-1.1/pairs.js
var require_pairs = __commonJS({
  "../../node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/schema/yaml-1.1/pairs.js"(exports) {
    "use strict";
    var identity = require_identity();
    var Pair = require_Pair();
    var Scalar = require_Scalar();
    var YAMLSeq2 = require_YAMLSeq();
    function resolvePairs(seq, onError) {
      if (identity.isSeq(seq)) {
        for (let i = 0; i < seq.items.length; ++i) {
          let item = seq.items[i];
          if (identity.isPair(item))
            continue;
          else if (identity.isMap(item)) {
            if (item.items.length > 1)
              onError("Each pair must have its own sequence indicator");
            const pair = item.items[0] || new Pair.Pair(new Scalar.Scalar(null));
            if (item.commentBefore)
              pair.key.commentBefore = pair.key.commentBefore ? `${item.commentBefore}
${pair.key.commentBefore}` : item.commentBefore;
            if (item.comment) {
              const cn = pair.value ?? pair.key;
              cn.comment = cn.comment ? `${item.comment}
${cn.comment}` : item.comment;
            }
            item = pair;
          }
          seq.items[i] = identity.isPair(item) ? item : new Pair.Pair(item);
        }
      } else
        onError("Expected a sequence for this tag");
      return seq;
    }
    function createPairs(schema, iterable, ctx) {
      const { replacer } = ctx;
      const pairs2 = new YAMLSeq2.YAMLSeq(schema);
      pairs2.tag = "tag:yaml.org,2002:pairs";
      let i = 0;
      if (iterable && Symbol.iterator in Object(iterable))
        for (let it of iterable) {
          if (typeof replacer === "function")
            it = replacer.call(iterable, String(i++), it);
          let key, value;
          if (Array.isArray(it)) {
            if (it.length === 2) {
              key = it[0];
              value = it[1];
            } else
              throw new TypeError(`Expected [key, value] tuple: ${it}`);
          } else if (it && it instanceof Object) {
            const keys = Object.keys(it);
            if (keys.length === 1) {
              key = keys[0];
              value = it[key];
            } else {
              throw new TypeError(`Expected tuple with one key, not ${keys.length} keys`);
            }
          } else {
            key = it;
          }
          pairs2.items.push(Pair.createPair(key, value, ctx));
        }
      return pairs2;
    }
    var pairs = {
      collection: "seq",
      default: false,
      tag: "tag:yaml.org,2002:pairs",
      resolve: resolvePairs,
      createNode: createPairs
    };
    exports.createPairs = createPairs;
    exports.pairs = pairs;
    exports.resolvePairs = resolvePairs;
  }
});

// ../../node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/schema/yaml-1.1/omap.js
var require_omap = __commonJS({
  "../../node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/schema/yaml-1.1/omap.js"(exports) {
    "use strict";
    var identity = require_identity();
    var toJS = require_toJS();
    var YAMLMap = require_YAMLMap();
    var YAMLSeq2 = require_YAMLSeq();
    var pairs = require_pairs();
    var YAMLOMap = class _YAMLOMap extends YAMLSeq2.YAMLSeq {
      constructor() {
        super();
        this.add = YAMLMap.YAMLMap.prototype.add.bind(this);
        this.delete = YAMLMap.YAMLMap.prototype.delete.bind(this);
        this.get = YAMLMap.YAMLMap.prototype.get.bind(this);
        this.has = YAMLMap.YAMLMap.prototype.has.bind(this);
        this.set = YAMLMap.YAMLMap.prototype.set.bind(this);
        this.tag = _YAMLOMap.tag;
      }
      /**
       * If `ctx` is given, the return type is actually `Map<unknown, unknown>`,
       * but TypeScript won't allow widening the signature of a child method.
       */
      toJSON(_, ctx) {
        if (!ctx)
          return super.toJSON(_);
        const map = /* @__PURE__ */ new Map();
        if (ctx?.onCreate)
          ctx.onCreate(map);
        for (const pair of this.items) {
          let key, value;
          if (identity.isPair(pair)) {
            key = toJS.toJS(pair.key, "", ctx);
            value = toJS.toJS(pair.value, key, ctx);
          } else {
            key = toJS.toJS(pair, "", ctx);
          }
          if (map.has(key))
            throw new Error("Ordered maps must not include duplicate keys");
          map.set(key, value);
        }
        return map;
      }
      static from(schema, iterable, ctx) {
        const pairs$1 = pairs.createPairs(schema, iterable, ctx);
        const omap2 = new this();
        omap2.items = pairs$1.items;
        return omap2;
      }
    };
    YAMLOMap.tag = "tag:yaml.org,2002:omap";
    var omap = {
      collection: "seq",
      identify: (value) => value instanceof Map,
      nodeClass: YAMLOMap,
      default: false,
      tag: "tag:yaml.org,2002:omap",
      resolve(seq, onError) {
        const pairs$1 = pairs.resolvePairs(seq, onError);
        const seenKeys = [];
        for (const { key } of pairs$1.items) {
          if (identity.isScalar(key)) {
            if (seenKeys.includes(key.value)) {
              onError(`Ordered maps must not include duplicate keys: ${key.value}`);
            } else {
              seenKeys.push(key.value);
            }
          }
        }
        return Object.assign(new YAMLOMap(), pairs$1);
      },
      createNode: (schema, iterable, ctx) => YAMLOMap.from(schema, iterable, ctx)
    };
    exports.YAMLOMap = YAMLOMap;
    exports.omap = omap;
  }
});

// ../../node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/schema/yaml-1.1/bool.js
var require_bool2 = __commonJS({
  "../../node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/schema/yaml-1.1/bool.js"(exports) {
    "use strict";
    var Scalar = require_Scalar();
    function boolStringify({ value, source }, ctx) {
      const boolObj = value ? trueTag : falseTag;
      if (source && boolObj.test.test(source))
        return source;
      return value ? ctx.options.trueStr : ctx.options.falseStr;
    }
    var trueTag = {
      identify: (value) => value === true,
      default: true,
      tag: "tag:yaml.org,2002:bool",
      test: /^(?:Y|y|[Yy]es|YES|[Tt]rue|TRUE|[Oo]n|ON)$/,
      resolve: () => new Scalar.Scalar(true),
      stringify: boolStringify
    };
    var falseTag = {
      identify: (value) => value === false,
      default: true,
      tag: "tag:yaml.org,2002:bool",
      test: /^(?:N|n|[Nn]o|NO|[Ff]alse|FALSE|[Oo]ff|OFF)$/,
      resolve: () => new Scalar.Scalar(false),
      stringify: boolStringify
    };
    exports.falseTag = falseTag;
    exports.trueTag = trueTag;
  }
});

// ../../node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/schema/yaml-1.1/float.js
var require_float2 = __commonJS({
  "../../node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/schema/yaml-1.1/float.js"(exports) {
    "use strict";
    var Scalar = require_Scalar();
    var stringifyNumber = require_stringifyNumber();
    var floatNaN = {
      identify: (value) => typeof value === "number",
      default: true,
      tag: "tag:yaml.org,2002:float",
      test: /^(?:[-+]?\.(?:inf|Inf|INF)|\.nan|\.NaN|\.NAN)$/,
      resolve: (str3) => str3.slice(-3).toLowerCase() === "nan" ? NaN : str3[0] === "-" ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY,
      stringify: stringifyNumber.stringifyNumber
    };
    var floatExp = {
      identify: (value) => typeof value === "number",
      default: true,
      tag: "tag:yaml.org,2002:float",
      format: "EXP",
      test: /^[-+]?(?:[0-9][0-9_]*)?(?:\.[0-9_]*)?[eE][-+]?[0-9]+$/,
      resolve: (str3) => parseFloat(str3.replace(/_/g, "")),
      stringify(node) {
        const num2 = Number(node.value);
        return isFinite(num2) ? num2.toExponential() : stringifyNumber.stringifyNumber(node);
      }
    };
    var float = {
      identify: (value) => typeof value === "number",
      default: true,
      tag: "tag:yaml.org,2002:float",
      test: /^[-+]?(?:[0-9][0-9_]*)?\.[0-9_]*$/,
      resolve(str3) {
        const node = new Scalar.Scalar(parseFloat(str3.replace(/_/g, "")));
        const dot = str3.indexOf(".");
        if (dot !== -1) {
          const f = str3.substring(dot + 1).replace(/_/g, "");
          if (f[f.length - 1] === "0")
            node.minFractionDigits = f.length;
        }
        return node;
      },
      stringify: stringifyNumber.stringifyNumber
    };
    exports.float = float;
    exports.floatExp = floatExp;
    exports.floatNaN = floatNaN;
  }
});

// ../../node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/schema/yaml-1.1/int.js
var require_int2 = __commonJS({
  "../../node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/schema/yaml-1.1/int.js"(exports) {
    "use strict";
    var stringifyNumber = require_stringifyNumber();
    var intIdentify = (value) => typeof value === "bigint" || Number.isInteger(value);
    function intResolve(str3, offset, radix, { intAsBigInt }) {
      const sign = str3[0];
      if (sign === "-" || sign === "+")
        offset += 1;
      str3 = str3.substring(offset).replace(/_/g, "");
      if (intAsBigInt) {
        switch (radix) {
          case 2:
            str3 = `0b${str3}`;
            break;
          case 8:
            str3 = `0o${str3}`;
            break;
          case 16:
            str3 = `0x${str3}`;
            break;
        }
        const n2 = BigInt(str3);
        return sign === "-" ? BigInt(-1) * n2 : n2;
      }
      const n = parseInt(str3, radix);
      return sign === "-" ? -1 * n : n;
    }
    function intStringify(node, radix, prefix) {
      const { value } = node;
      if (intIdentify(value)) {
        const str3 = value.toString(radix);
        return value < 0 ? "-" + prefix + str3.substr(1) : prefix + str3;
      }
      return stringifyNumber.stringifyNumber(node);
    }
    var intBin = {
      identify: intIdentify,
      default: true,
      tag: "tag:yaml.org,2002:int",
      format: "BIN",
      test: /^[-+]?0b[0-1_]+$/,
      resolve: (str3, _onError, opt) => intResolve(str3, 2, 2, opt),
      stringify: (node) => intStringify(node, 2, "0b")
    };
    var intOct = {
      identify: intIdentify,
      default: true,
      tag: "tag:yaml.org,2002:int",
      format: "OCT",
      test: /^[-+]?0[0-7_]+$/,
      resolve: (str3, _onError, opt) => intResolve(str3, 1, 8, opt),
      stringify: (node) => intStringify(node, 8, "0")
    };
    var int = {
      identify: intIdentify,
      default: true,
      tag: "tag:yaml.org,2002:int",
      test: /^[-+]?[0-9][0-9_]*$/,
      resolve: (str3, _onError, opt) => intResolve(str3, 0, 10, opt),
      stringify: stringifyNumber.stringifyNumber
    };
    var intHex = {
      identify: intIdentify,
      default: true,
      tag: "tag:yaml.org,2002:int",
      format: "HEX",
      test: /^[-+]?0x[0-9a-fA-F_]+$/,
      resolve: (str3, _onError, opt) => intResolve(str3, 2, 16, opt),
      stringify: (node) => intStringify(node, 16, "0x")
    };
    exports.int = int;
    exports.intBin = intBin;
    exports.intHex = intHex;
    exports.intOct = intOct;
  }
});

// ../../node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/schema/yaml-1.1/set.js
var require_set = __commonJS({
  "../../node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/schema/yaml-1.1/set.js"(exports) {
    "use strict";
    var identity = require_identity();
    var Pair = require_Pair();
    var YAMLMap = require_YAMLMap();
    var YAMLSet = class _YAMLSet extends YAMLMap.YAMLMap {
      constructor(schema) {
        super(schema);
        this.tag = _YAMLSet.tag;
      }
      add(key) {
        let pair;
        if (identity.isPair(key))
          pair = key;
        else if (key && typeof key === "object" && "key" in key && "value" in key && key.value === null)
          pair = new Pair.Pair(key.key, null);
        else
          pair = new Pair.Pair(key, null);
        const prev = YAMLMap.findPair(this.items, pair.key);
        if (!prev)
          this.items.push(pair);
      }
      /**
       * If `keepPair` is `true`, returns the Pair matching `key`.
       * Otherwise, returns the value of that Pair's key.
       */
      get(key, keepPair) {
        const pair = YAMLMap.findPair(this.items, key);
        return !keepPair && identity.isPair(pair) ? identity.isScalar(pair.key) ? pair.key.value : pair.key : pair;
      }
      set(key, value) {
        if (typeof value !== "boolean")
          throw new Error(`Expected boolean value for set(key, value) in a YAML set, not ${typeof value}`);
        const prev = YAMLMap.findPair(this.items, key);
        if (prev && !value) {
          this.items.splice(this.items.indexOf(prev), 1);
        } else if (!prev && value) {
          this.items.push(new Pair.Pair(key));
        }
      }
      toJSON(_, ctx) {
        return super.toJSON(_, ctx, Set);
      }
      toString(ctx, onComment, onChompKeep) {
        if (!ctx)
          return JSON.stringify(this);
        if (this.hasAllNullValues(true))
          return super.toString(Object.assign({}, ctx, { allNullValues: true }), onComment, onChompKeep);
        else
          throw new Error("Set items must all have null values");
      }
      static from(schema, iterable, ctx) {
        const { replacer } = ctx;
        const set2 = new this(schema);
        if (iterable && Symbol.iterator in Object(iterable))
          for (let value of iterable) {
            if (typeof replacer === "function")
              value = replacer.call(iterable, value, value);
            set2.items.push(Pair.createPair(value, null, ctx));
          }
        return set2;
      }
    };
    YAMLSet.tag = "tag:yaml.org,2002:set";
    var set = {
      collection: "map",
      identify: (value) => value instanceof Set,
      nodeClass: YAMLSet,
      default: false,
      tag: "tag:yaml.org,2002:set",
      createNode: (schema, iterable, ctx) => YAMLSet.from(schema, iterable, ctx),
      resolve(map, onError) {
        if (identity.isMap(map)) {
          if (map.hasAllNullValues(true))
            return Object.assign(new YAMLSet(), map);
          else
            onError("Set items must all have null values");
        } else
          onError("Expected a mapping for this tag");
        return map;
      }
    };
    exports.YAMLSet = YAMLSet;
    exports.set = set;
  }
});

// ../../node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/schema/yaml-1.1/timestamp.js
var require_timestamp = __commonJS({
  "../../node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/schema/yaml-1.1/timestamp.js"(exports) {
    "use strict";
    var stringifyNumber = require_stringifyNumber();
    function parseSexagesimal(str3, asBigInt) {
      const sign = str3[0];
      const parts = sign === "-" || sign === "+" ? str3.substring(1) : str3;
      const num2 = (n) => asBigInt ? BigInt(n) : Number(n);
      const res = parts.replace(/_/g, "").split(":").reduce((res2, p) => res2 * num2(60) + num2(p), num2(0));
      return sign === "-" ? num2(-1) * res : res;
    }
    function stringifySexagesimal(node) {
      let { value } = node;
      let num2 = (n) => n;
      if (typeof value === "bigint")
        num2 = (n) => BigInt(n);
      else if (isNaN(value) || !isFinite(value))
        return stringifyNumber.stringifyNumber(node);
      let sign = "";
      if (value < 0) {
        sign = "-";
        value *= num2(-1);
      }
      const _60 = num2(60);
      const parts = [value % _60];
      if (value < 60) {
        parts.unshift(0);
      } else {
        value = (value - parts[0]) / _60;
        parts.unshift(value % _60);
        if (value >= 60) {
          value = (value - parts[0]) / _60;
          parts.unshift(value);
        }
      }
      return sign + parts.map((n) => String(n).padStart(2, "0")).join(":").replace(/000000\d*$/, "");
    }
    var intTime = {
      identify: (value) => typeof value === "bigint" || Number.isInteger(value),
      default: true,
      tag: "tag:yaml.org,2002:int",
      format: "TIME",
      test: /^[-+]?[0-9][0-9_]*(?::[0-5]?[0-9])+$/,
      resolve: (str3, _onError, { intAsBigInt }) => parseSexagesimal(str3, intAsBigInt),
      stringify: stringifySexagesimal
    };
    var floatTime = {
      identify: (value) => typeof value === "number",
      default: true,
      tag: "tag:yaml.org,2002:float",
      format: "TIME",
      test: /^[-+]?[0-9][0-9_]*(?::[0-5]?[0-9])+\.[0-9_]*$/,
      resolve: (str3) => parseSexagesimal(str3, false),
      stringify: stringifySexagesimal
    };
    var timestamp = {
      identify: (value) => value instanceof Date,
      default: true,
      tag: "tag:yaml.org,2002:timestamp",
      // If the time zone is omitted, the timestamp is assumed to be specified in UTC. The time part
      // may be omitted altogether, resulting in a date format. In such a case, the time part is
      // assumed to be 00:00:00Z (start of day, UTC).
      test: RegExp("^([0-9]{4})-([0-9]{1,2})-([0-9]{1,2})(?:(?:t|T|[ \\t]+)([0-9]{1,2}):([0-9]{1,2}):([0-9]{1,2}(\\.[0-9]+)?)(?:[ \\t]*(Z|[-+][012]?[0-9](?::[0-9]{2})?))?)?$"),
      resolve(str3) {
        const match = str3.match(timestamp.test);
        if (!match)
          throw new Error("!!timestamp expects a date, starting with yyyy-mm-dd");
        const [, year, month, day, hour, minute, second] = match.map(Number);
        const millisec = match[7] ? Number((match[7] + "00").substr(1, 3)) : 0;
        let date = Date.UTC(year, month - 1, day, hour || 0, minute || 0, second || 0, millisec);
        const tz = match[8];
        if (tz && tz !== "Z") {
          let d = parseSexagesimal(tz, false);
          if (Math.abs(d) < 30)
            d *= 60;
          date -= 6e4 * d;
        }
        return new Date(date);
      },
      stringify: ({ value }) => value?.toISOString().replace(/(T00:00:00)?\.000Z$/, "") ?? ""
    };
    exports.floatTime = floatTime;
    exports.intTime = intTime;
    exports.timestamp = timestamp;
  }
});

// ../../node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/schema/yaml-1.1/schema.js
var require_schema3 = __commonJS({
  "../../node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/schema/yaml-1.1/schema.js"(exports) {
    "use strict";
    var map = require_map();
    var _null = require_null();
    var seq = require_seq();
    var string = require_string();
    var binary = require_binary();
    var bool = require_bool2();
    var float = require_float2();
    var int = require_int2();
    var merge = require_merge();
    var omap = require_omap();
    var pairs = require_pairs();
    var set = require_set();
    var timestamp = require_timestamp();
    var schema = [
      map.map,
      seq.seq,
      string.string,
      _null.nullTag,
      bool.trueTag,
      bool.falseTag,
      int.intBin,
      int.intOct,
      int.int,
      int.intHex,
      float.floatNaN,
      float.floatExp,
      float.float,
      binary.binary,
      merge.merge,
      omap.omap,
      pairs.pairs,
      set.set,
      timestamp.intTime,
      timestamp.floatTime,
      timestamp.timestamp
    ];
    exports.schema = schema;
  }
});

// ../../node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/schema/tags.js
var require_tags = __commonJS({
  "../../node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/schema/tags.js"(exports) {
    "use strict";
    var map = require_map();
    var _null = require_null();
    var seq = require_seq();
    var string = require_string();
    var bool = require_bool();
    var float = require_float();
    var int = require_int();
    var schema = require_schema();
    var schema$1 = require_schema2();
    var binary = require_binary();
    var merge = require_merge();
    var omap = require_omap();
    var pairs = require_pairs();
    var schema$2 = require_schema3();
    var set = require_set();
    var timestamp = require_timestamp();
    var schemas = /* @__PURE__ */ new Map([
      ["core", schema.schema],
      ["failsafe", [map.map, seq.seq, string.string]],
      ["json", schema$1.schema],
      ["yaml11", schema$2.schema],
      ["yaml-1.1", schema$2.schema]
    ]);
    var tagsByName = {
      binary: binary.binary,
      bool: bool.boolTag,
      float: float.float,
      floatExp: float.floatExp,
      floatNaN: float.floatNaN,
      floatTime: timestamp.floatTime,
      int: int.int,
      intHex: int.intHex,
      intOct: int.intOct,
      intTime: timestamp.intTime,
      map: map.map,
      merge: merge.merge,
      null: _null.nullTag,
      omap: omap.omap,
      pairs: pairs.pairs,
      seq: seq.seq,
      set: set.set,
      timestamp: timestamp.timestamp
    };
    var coreKnownTags = {
      "tag:yaml.org,2002:binary": binary.binary,
      "tag:yaml.org,2002:merge": merge.merge,
      "tag:yaml.org,2002:omap": omap.omap,
      "tag:yaml.org,2002:pairs": pairs.pairs,
      "tag:yaml.org,2002:set": set.set,
      "tag:yaml.org,2002:timestamp": timestamp.timestamp
    };
    function getTags(customTags, schemaName, addMergeTag) {
      const schemaTags = schemas.get(schemaName);
      if (schemaTags && !customTags) {
        return addMergeTag && !schemaTags.includes(merge.merge) ? schemaTags.concat(merge.merge) : schemaTags.slice();
      }
      let tags = schemaTags;
      if (!tags) {
        if (Array.isArray(customTags))
          tags = [];
        else {
          const keys = Array.from(schemas.keys()).filter((key) => key !== "yaml11").map((key) => JSON.stringify(key)).join(", ");
          throw new Error(`Unknown schema "${schemaName}"; use one of ${keys} or define customTags array`);
        }
      }
      if (Array.isArray(customTags)) {
        for (const tag of customTags)
          tags = tags.concat(tag);
      } else if (typeof customTags === "function") {
        tags = customTags(tags.slice());
      }
      if (addMergeTag)
        tags = tags.concat(merge.merge);
      return tags.reduce((tags2, tag) => {
        const tagObj = typeof tag === "string" ? tagsByName[tag] : tag;
        if (!tagObj) {
          const tagName = JSON.stringify(tag);
          const keys = Object.keys(tagsByName).map((key) => JSON.stringify(key)).join(", ");
          throw new Error(`Unknown custom tag ${tagName}; use one of ${keys}`);
        }
        if (!tags2.includes(tagObj))
          tags2.push(tagObj);
        return tags2;
      }, []);
    }
    exports.coreKnownTags = coreKnownTags;
    exports.getTags = getTags;
  }
});

// ../../node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/schema/Schema.js
var require_Schema = __commonJS({
  "../../node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/schema/Schema.js"(exports) {
    "use strict";
    var identity = require_identity();
    var map = require_map();
    var seq = require_seq();
    var string = require_string();
    var tags = require_tags();
    var sortMapEntriesByKey = (a, b) => a.key < b.key ? -1 : a.key > b.key ? 1 : 0;
    var Schema = class _Schema {
      constructor({ compat, customTags, merge, resolveKnownTags, schema, sortMapEntries, toStringDefaults }) {
        this.compat = Array.isArray(compat) ? tags.getTags(compat, "compat") : compat ? tags.getTags(null, compat) : null;
        this.name = typeof schema === "string" && schema || "core";
        this.knownTags = resolveKnownTags ? tags.coreKnownTags : {};
        this.tags = tags.getTags(customTags, this.name, merge);
        this.toStringOptions = toStringDefaults ?? null;
        Object.defineProperty(this, identity.MAP, { value: map.map });
        Object.defineProperty(this, identity.SCALAR, { value: string.string });
        Object.defineProperty(this, identity.SEQ, { value: seq.seq });
        this.sortMapEntries = typeof sortMapEntries === "function" ? sortMapEntries : sortMapEntries === true ? sortMapEntriesByKey : null;
      }
      clone() {
        const copy = Object.create(_Schema.prototype, Object.getOwnPropertyDescriptors(this));
        copy.tags = this.tags.slice();
        return copy;
      }
    };
    exports.Schema = Schema;
  }
});

// ../../node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/stringify/stringifyDocument.js
var require_stringifyDocument = __commonJS({
  "../../node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/stringify/stringifyDocument.js"(exports) {
    "use strict";
    var identity = require_identity();
    var stringify = require_stringify();
    var stringifyComment = require_stringifyComment();
    function stringifyDocument(doc, options) {
      const lines = [];
      let hasDirectives = options.directives === true;
      if (options.directives !== false && doc.directives) {
        const dir = doc.directives.toString(doc);
        if (dir) {
          lines.push(dir);
          hasDirectives = true;
        } else if (doc.directives.docStart)
          hasDirectives = true;
      }
      if (hasDirectives)
        lines.push("---");
      const ctx = stringify.createStringifyContext(doc, options);
      const { commentString } = ctx.options;
      if (doc.commentBefore) {
        if (lines.length !== 1)
          lines.unshift("");
        const cs = commentString(doc.commentBefore);
        lines.unshift(stringifyComment.indentComment(cs, ""));
      }
      let chompKeep = false;
      let contentComment = null;
      if (doc.contents) {
        if (identity.isNode(doc.contents)) {
          if (doc.contents.spaceBefore && hasDirectives)
            lines.push("");
          if (doc.contents.commentBefore) {
            const cs = commentString(doc.contents.commentBefore);
            lines.push(stringifyComment.indentComment(cs, ""));
          }
          ctx.forceBlockIndent = !!doc.comment;
          contentComment = doc.contents.comment;
        }
        const onChompKeep = contentComment ? void 0 : () => chompKeep = true;
        let body = stringify.stringify(doc.contents, ctx, () => contentComment = null, onChompKeep);
        if (contentComment)
          body += stringifyComment.lineComment(body, "", commentString(contentComment));
        if ((body[0] === "|" || body[0] === ">") && lines[lines.length - 1] === "---") {
          lines[lines.length - 1] = `--- ${body}`;
        } else
          lines.push(body);
      } else {
        lines.push(stringify.stringify(doc.contents, ctx));
      }
      if (doc.directives?.docEnd) {
        if (doc.comment) {
          const cs = commentString(doc.comment);
          if (cs.includes("\n")) {
            lines.push("...");
            lines.push(stringifyComment.indentComment(cs, ""));
          } else {
            lines.push(`... ${cs}`);
          }
        } else {
          lines.push("...");
        }
      } else {
        let dc = doc.comment;
        if (dc && chompKeep)
          dc = dc.replace(/^\n+/, "");
        if (dc) {
          if ((!chompKeep || contentComment) && lines[lines.length - 1] !== "")
            lines.push("");
          lines.push(stringifyComment.indentComment(commentString(dc), ""));
        }
      }
      return lines.join("\n") + "\n";
    }
    exports.stringifyDocument = stringifyDocument;
  }
});

// ../../node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/doc/Document.js
var require_Document = __commonJS({
  "../../node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/doc/Document.js"(exports) {
    "use strict";
    var Alias = require_Alias();
    var Collection = require_Collection();
    var identity = require_identity();
    var Pair = require_Pair();
    var toJS = require_toJS();
    var Schema = require_Schema();
    var stringifyDocument = require_stringifyDocument();
    var anchors = require_anchors();
    var applyReviver = require_applyReviver();
    var createNode = require_createNode();
    var directives = require_directives();
    var Document = class _Document {
      constructor(value, replacer, options) {
        this.commentBefore = null;
        this.comment = null;
        this.errors = [];
        this.warnings = [];
        Object.defineProperty(this, identity.NODE_TYPE, { value: identity.DOC });
        let _replacer = null;
        if (typeof replacer === "function" || Array.isArray(replacer)) {
          _replacer = replacer;
        } else if (options === void 0 && replacer) {
          options = replacer;
          replacer = void 0;
        }
        const opt = Object.assign({
          intAsBigInt: false,
          keepSourceTokens: false,
          logLevel: "warn",
          prettyErrors: true,
          strict: true,
          stringKeys: false,
          uniqueKeys: true,
          version: "1.2"
        }, options);
        this.options = opt;
        let { version } = opt;
        if (options?._directives) {
          this.directives = options._directives.atDocument();
          if (this.directives.yaml.explicit)
            version = this.directives.yaml.version;
        } else
          this.directives = new directives.Directives({ version });
        this.setSchema(version, options);
        this.contents = value === void 0 ? null : this.createNode(value, _replacer, options);
      }
      /**
       * Create a deep copy of this Document and its contents.
       *
       * Custom Node values that inherit from `Object` still refer to their original instances.
       */
      clone() {
        const copy = Object.create(_Document.prototype, {
          [identity.NODE_TYPE]: { value: identity.DOC }
        });
        copy.commentBefore = this.commentBefore;
        copy.comment = this.comment;
        copy.errors = this.errors.slice();
        copy.warnings = this.warnings.slice();
        copy.options = Object.assign({}, this.options);
        if (this.directives)
          copy.directives = this.directives.clone();
        copy.schema = this.schema.clone();
        copy.contents = identity.isNode(this.contents) ? this.contents.clone(copy.schema) : this.contents;
        if (this.range)
          copy.range = this.range.slice();
        return copy;
      }
      /** Adds a value to the document. */
      add(value) {
        if (assertCollection(this.contents))
          this.contents.add(value);
      }
      /** Adds a value to the document. */
      addIn(path, value) {
        if (assertCollection(this.contents))
          this.contents.addIn(path, value);
      }
      /**
       * Create a new `Alias` node, ensuring that the target `node` has the required anchor.
       *
       * If `node` already has an anchor, `name` is ignored.
       * Otherwise, the `node.anchor` value will be set to `name`,
       * or if an anchor with that name is already present in the document,
       * `name` will be used as a prefix for a new unique anchor.
       * If `name` is undefined, the generated anchor will use 'a' as a prefix.
       */
      createAlias(node, name) {
        if (!node.anchor) {
          const prev = anchors.anchorNames(this);
          node.anchor = // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
          !name || prev.has(name) ? anchors.findNewAnchor(name || "a", prev) : name;
        }
        return new Alias.Alias(node.anchor);
      }
      createNode(value, replacer, options) {
        let _replacer = void 0;
        if (typeof replacer === "function") {
          value = replacer.call({ "": value }, "", value);
          _replacer = replacer;
        } else if (Array.isArray(replacer)) {
          const keyToStr = (v) => typeof v === "number" || v instanceof String || v instanceof Number;
          const asStr = replacer.filter(keyToStr).map(String);
          if (asStr.length > 0)
            replacer = replacer.concat(asStr);
          _replacer = replacer;
        } else if (options === void 0 && replacer) {
          options = replacer;
          replacer = void 0;
        }
        const { aliasDuplicateObjects, anchorPrefix, flow, keepUndefined, onTagObj, tag } = options ?? {};
        const { onAnchor, setAnchors, sourceObjects } = anchors.createNodeAnchors(
          this,
          // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
          anchorPrefix || "a"
        );
        const ctx = {
          aliasDuplicateObjects: aliasDuplicateObjects ?? true,
          keepUndefined: keepUndefined ?? false,
          onAnchor,
          onTagObj,
          replacer: _replacer,
          schema: this.schema,
          sourceObjects
        };
        const node = createNode.createNode(value, tag, ctx);
        if (flow && identity.isCollection(node))
          node.flow = true;
        setAnchors();
        return node;
      }
      /**
       * Convert a key and a value into a `Pair` using the current schema,
       * recursively wrapping all values as `Scalar` or `Collection` nodes.
       */
      createPair(key, value, options = {}) {
        const k = this.createNode(key, null, options);
        const v = this.createNode(value, null, options);
        return new Pair.Pair(k, v);
      }
      /**
       * Removes a value from the document.
       * @returns `true` if the item was found and removed.
       */
      delete(key) {
        return assertCollection(this.contents) ? this.contents.delete(key) : false;
      }
      /**
       * Removes a value from the document.
       * @returns `true` if the item was found and removed.
       */
      deleteIn(path) {
        if (Collection.isEmptyPath(path)) {
          if (this.contents == null)
            return false;
          this.contents = null;
          return true;
        }
        return assertCollection(this.contents) ? this.contents.deleteIn(path) : false;
      }
      /**
       * Returns item at `key`, or `undefined` if not found. By default unwraps
       * scalar values from their surrounding node; to disable set `keepScalar` to
       * `true` (collections are always returned intact).
       */
      get(key, keepScalar) {
        return identity.isCollection(this.contents) ? this.contents.get(key, keepScalar) : void 0;
      }
      /**
       * Returns item at `path`, or `undefined` if not found. By default unwraps
       * scalar values from their surrounding node; to disable set `keepScalar` to
       * `true` (collections are always returned intact).
       */
      getIn(path, keepScalar) {
        if (Collection.isEmptyPath(path))
          return !keepScalar && identity.isScalar(this.contents) ? this.contents.value : this.contents;
        return identity.isCollection(this.contents) ? this.contents.getIn(path, keepScalar) : void 0;
      }
      /**
       * Checks if the document includes a value with the key `key`.
       */
      has(key) {
        return identity.isCollection(this.contents) ? this.contents.has(key) : false;
      }
      /**
       * Checks if the document includes a value at `path`.
       */
      hasIn(path) {
        if (Collection.isEmptyPath(path))
          return this.contents !== void 0;
        return identity.isCollection(this.contents) ? this.contents.hasIn(path) : false;
      }
      /**
       * Sets a value in this document. For `!!set`, `value` needs to be a
       * boolean to add/remove the item from the set.
       */
      set(key, value) {
        if (this.contents == null) {
          this.contents = Collection.collectionFromPath(this.schema, [key], value);
        } else if (assertCollection(this.contents)) {
          this.contents.set(key, value);
        }
      }
      /**
       * Sets a value in this document. For `!!set`, `value` needs to be a
       * boolean to add/remove the item from the set.
       */
      setIn(path, value) {
        if (Collection.isEmptyPath(path)) {
          this.contents = value;
        } else if (this.contents == null) {
          this.contents = Collection.collectionFromPath(this.schema, Array.from(path), value);
        } else if (assertCollection(this.contents)) {
          this.contents.setIn(path, value);
        }
      }
      /**
       * Change the YAML version and schema used by the document.
       * A `null` version disables support for directives, explicit tags, anchors, and aliases.
       * It also requires the `schema` option to be given as a `Schema` instance value.
       *
       * Overrides all previously set schema options.
       */
      setSchema(version, options = {}) {
        if (typeof version === "number")
          version = String(version);
        let opt;
        switch (version) {
          case "1.1":
            if (this.directives)
              this.directives.yaml.version = "1.1";
            else
              this.directives = new directives.Directives({ version: "1.1" });
            opt = { resolveKnownTags: false, schema: "yaml-1.1" };
            break;
          case "1.2":
          case "next":
            if (this.directives)
              this.directives.yaml.version = version;
            else
              this.directives = new directives.Directives({ version });
            opt = { resolveKnownTags: true, schema: "core" };
            break;
          case null:
            if (this.directives)
              delete this.directives;
            opt = null;
            break;
          default: {
            const sv = JSON.stringify(version);
            throw new Error(`Expected '1.1', '1.2' or null as first argument, but found: ${sv}`);
          }
        }
        if (options.schema instanceof Object)
          this.schema = options.schema;
        else if (opt)
          this.schema = new Schema.Schema(Object.assign(opt, options));
        else
          throw new Error(`With a null YAML version, the { schema: Schema } option is required`);
      }
      // json & jsonArg are only used from toJSON()
      toJS({ json, jsonArg, mapAsMap, maxAliasCount, onAnchor, reviver } = {}) {
        const ctx = {
          anchors: /* @__PURE__ */ new Map(),
          doc: this,
          keep: !json,
          mapAsMap: mapAsMap === true,
          mapKeyWarned: false,
          maxAliasCount: typeof maxAliasCount === "number" ? maxAliasCount : 100
        };
        const res = toJS.toJS(this.contents, jsonArg ?? "", ctx);
        if (typeof onAnchor === "function")
          for (const { count, res: res2 } of ctx.anchors.values())
            onAnchor(res2, count);
        return typeof reviver === "function" ? applyReviver.applyReviver(reviver, { "": res }, "", res) : res;
      }
      /**
       * A JSON representation of the document `contents`.
       *
       * @param jsonArg Used by `JSON.stringify` to indicate the array index or
       *   property name.
       */
      toJSON(jsonArg, onAnchor) {
        return this.toJS({ json: true, jsonArg, mapAsMap: false, onAnchor });
      }
      /** A YAML representation of the document. */
      toString(options = {}) {
        if (this.errors.length > 0)
          throw new Error("Document with errors cannot be stringified");
        if ("indent" in options && (!Number.isInteger(options.indent) || Number(options.indent) <= 0)) {
          const s = JSON.stringify(options.indent);
          throw new Error(`"indent" option must be a positive integer, not ${s}`);
        }
        return stringifyDocument.stringifyDocument(this, options);
      }
    };
    function assertCollection(contents) {
      if (identity.isCollection(contents))
        return true;
      throw new Error("Expected a YAML collection as document contents");
    }
    exports.Document = Document;
  }
});

// ../../node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/errors.js
var require_errors = __commonJS({
  "../../node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/errors.js"(exports) {
    "use strict";
    var YAMLError = class extends Error {
      constructor(name, pos, code, message) {
        super();
        this.name = name;
        this.code = code;
        this.message = message;
        this.pos = pos;
      }
    };
    var YAMLParseError = class extends YAMLError {
      constructor(pos, code, message) {
        super("YAMLParseError", pos, code, message);
      }
    };
    var YAMLWarning = class extends YAMLError {
      constructor(pos, code, message) {
        super("YAMLWarning", pos, code, message);
      }
    };
    var prettifyError = (src, lc) => (error) => {
      if (error.pos[0] === -1)
        return;
      error.linePos = error.pos.map((pos) => lc.linePos(pos));
      const { line, col } = error.linePos[0];
      error.message += ` at line ${line}, column ${col}`;
      let ci = col - 1;
      let lineStr = src.substring(lc.lineStarts[line - 1], lc.lineStarts[line]).replace(/[\n\r]+$/, "");
      if (ci >= 60 && lineStr.length > 80) {
        const trimStart = Math.min(ci - 39, lineStr.length - 79);
        lineStr = "\u2026" + lineStr.substring(trimStart);
        ci -= trimStart - 1;
      }
      if (lineStr.length > 80)
        lineStr = lineStr.substring(0, 79) + "\u2026";
      if (line > 1 && /^ *$/.test(lineStr.substring(0, ci))) {
        let prev = src.substring(lc.lineStarts[line - 2], lc.lineStarts[line - 1]);
        if (prev.length > 80)
          prev = prev.substring(0, 79) + "\u2026\n";
        lineStr = prev + lineStr;
      }
      if (/[^ ]/.test(lineStr)) {
        let count = 1;
        const end = error.linePos[1];
        if (end?.line === line && end.col > col) {
          count = Math.max(1, Math.min(end.col - col, 80 - ci));
        }
        const pointer = " ".repeat(ci) + "^".repeat(count);
        error.message += `:

${lineStr}
${pointer}
`;
      }
    };
    exports.YAMLError = YAMLError;
    exports.YAMLParseError = YAMLParseError;
    exports.YAMLWarning = YAMLWarning;
    exports.prettifyError = prettifyError;
  }
});

// ../../node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/compose/resolve-props.js
var require_resolve_props = __commonJS({
  "../../node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/compose/resolve-props.js"(exports) {
    "use strict";
    function resolveProps(tokens, { flow, indicator, next, offset, onError, parentIndent, startOnNewline }) {
      let spaceBefore = false;
      let atNewline = startOnNewline;
      let hasSpace = startOnNewline;
      let comment = "";
      let commentSep = "";
      let hasNewline = false;
      let reqSpace = false;
      let tab = null;
      let anchor = null;
      let tag = null;
      let newlineAfterProp = null;
      let comma = null;
      let found = null;
      let start = null;
      for (const token of tokens) {
        if (reqSpace) {
          if (token.type !== "space" && token.type !== "newline" && token.type !== "comma")
            onError(token.offset, "MISSING_CHAR", "Tags and anchors must be separated from the next token by white space");
          reqSpace = false;
        }
        if (tab) {
          if (atNewline && token.type !== "comment" && token.type !== "newline") {
            onError(tab, "TAB_AS_INDENT", "Tabs are not allowed as indentation");
          }
          tab = null;
        }
        switch (token.type) {
          case "space":
            if (!flow && (indicator !== "doc-start" || next?.type !== "flow-collection") && token.source.includes("	")) {
              tab = token;
            }
            hasSpace = true;
            break;
          case "comment": {
            if (!hasSpace)
              onError(token, "MISSING_CHAR", "Comments must be separated from other tokens by white space characters");
            const cb = token.source.substring(1) || " ";
            if (!comment)
              comment = cb;
            else
              comment += commentSep + cb;
            commentSep = "";
            atNewline = false;
            break;
          }
          case "newline":
            if (atNewline) {
              if (comment)
                comment += token.source;
              else if (!found || indicator !== "seq-item-ind")
                spaceBefore = true;
            } else
              commentSep += token.source;
            atNewline = true;
            hasNewline = true;
            if (anchor || tag)
              newlineAfterProp = token;
            hasSpace = true;
            break;
          case "anchor":
            if (anchor)
              onError(token, "MULTIPLE_ANCHORS", "A node can have at most one anchor");
            if (token.source.endsWith(":"))
              onError(token.offset + token.source.length - 1, "BAD_ALIAS", "Anchor ending in : is ambiguous", true);
            anchor = token;
            start ?? (start = token.offset);
            atNewline = false;
            hasSpace = false;
            reqSpace = true;
            break;
          case "tag": {
            if (tag)
              onError(token, "MULTIPLE_TAGS", "A node can have at most one tag");
            tag = token;
            start ?? (start = token.offset);
            atNewline = false;
            hasSpace = false;
            reqSpace = true;
            break;
          }
          case indicator:
            if (anchor || tag)
              onError(token, "BAD_PROP_ORDER", `Anchors and tags must be after the ${token.source} indicator`);
            if (found)
              onError(token, "UNEXPECTED_TOKEN", `Unexpected ${token.source} in ${flow ?? "collection"}`);
            found = token;
            atNewline = indicator === "seq-item-ind" || indicator === "explicit-key-ind";
            hasSpace = false;
            break;
          case "comma":
            if (flow) {
              if (comma)
                onError(token, "UNEXPECTED_TOKEN", `Unexpected , in ${flow}`);
              comma = token;
              atNewline = false;
              hasSpace = false;
              break;
            }
          // else fallthrough
          default:
            onError(token, "UNEXPECTED_TOKEN", `Unexpected ${token.type} token`);
            atNewline = false;
            hasSpace = false;
        }
      }
      const last = tokens[tokens.length - 1];
      const end = last ? last.offset + last.source.length : offset;
      if (reqSpace && next && next.type !== "space" && next.type !== "newline" && next.type !== "comma" && (next.type !== "scalar" || next.source !== "")) {
        onError(next.offset, "MISSING_CHAR", "Tags and anchors must be separated from the next token by white space");
      }
      if (tab && (atNewline && tab.indent <= parentIndent || next?.type === "block-map" || next?.type === "block-seq"))
        onError(tab, "TAB_AS_INDENT", "Tabs are not allowed as indentation");
      return {
        comma,
        found,
        spaceBefore,
        comment,
        hasNewline,
        anchor,
        tag,
        newlineAfterProp,
        end,
        start: start ?? end
      };
    }
    exports.resolveProps = resolveProps;
  }
});

// ../../node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/compose/util-contains-newline.js
var require_util_contains_newline = __commonJS({
  "../../node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/compose/util-contains-newline.js"(exports) {
    "use strict";
    function containsNewline(key) {
      if (!key)
        return null;
      switch (key.type) {
        case "alias":
        case "scalar":
        case "double-quoted-scalar":
        case "single-quoted-scalar":
          if (key.source.includes("\n"))
            return true;
          if (key.end) {
            for (const st of key.end)
              if (st.type === "newline")
                return true;
          }
          return false;
        case "flow-collection":
          for (const it of key.items) {
            for (const st of it.start)
              if (st.type === "newline")
                return true;
            if (it.sep) {
              for (const st of it.sep)
                if (st.type === "newline")
                  return true;
            }
            if (containsNewline(it.key) || containsNewline(it.value))
              return true;
          }
          return false;
        default:
          return true;
      }
    }
    exports.containsNewline = containsNewline;
  }
});

// ../../node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/compose/util-flow-indent-check.js
var require_util_flow_indent_check = __commonJS({
  "../../node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/compose/util-flow-indent-check.js"(exports) {
    "use strict";
    var utilContainsNewline = require_util_contains_newline();
    function flowIndentCheck(indent, fc, onError) {
      if (fc?.type === "flow-collection") {
        const end = fc.end[0];
        if (end.indent === indent && (end.source === "]" || end.source === "}") && utilContainsNewline.containsNewline(fc)) {
          const msg = "Flow end indicator should be more indented than parent";
          onError(end, "BAD_INDENT", msg, true);
        }
      }
    }
    exports.flowIndentCheck = flowIndentCheck;
  }
});

// ../../node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/compose/util-map-includes.js
var require_util_map_includes = __commonJS({
  "../../node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/compose/util-map-includes.js"(exports) {
    "use strict";
    var identity = require_identity();
    function mapIncludes(ctx, items, search) {
      const { uniqueKeys } = ctx.options;
      if (uniqueKeys === false)
        return false;
      const isEqual = typeof uniqueKeys === "function" ? uniqueKeys : (a, b) => a === b || identity.isScalar(a) && identity.isScalar(b) && a.value === b.value;
      return items.some((pair) => isEqual(pair.key, search));
    }
    exports.mapIncludes = mapIncludes;
  }
});

// ../../node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/compose/resolve-block-map.js
var require_resolve_block_map = __commonJS({
  "../../node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/compose/resolve-block-map.js"(exports) {
    "use strict";
    var Pair = require_Pair();
    var YAMLMap = require_YAMLMap();
    var resolveProps = require_resolve_props();
    var utilContainsNewline = require_util_contains_newline();
    var utilFlowIndentCheck = require_util_flow_indent_check();
    var utilMapIncludes = require_util_map_includes();
    var startColMsg = "All mapping items must start at the same column";
    function resolveBlockMap({ composeNode, composeEmptyNode }, ctx, bm, onError, tag) {
      const NodeClass = tag?.nodeClass ?? YAMLMap.YAMLMap;
      const map = new NodeClass(ctx.schema);
      if (ctx.atRoot)
        ctx.atRoot = false;
      let offset = bm.offset;
      let commentEnd = null;
      for (const collItem of bm.items) {
        const { start, key, sep: sep2, value } = collItem;
        const keyProps = resolveProps.resolveProps(start, {
          indicator: "explicit-key-ind",
          next: key ?? sep2?.[0],
          offset,
          onError,
          parentIndent: bm.indent,
          startOnNewline: true
        });
        const implicitKey = !keyProps.found;
        if (implicitKey) {
          if (key) {
            if (key.type === "block-seq")
              onError(offset, "BLOCK_AS_IMPLICIT_KEY", "A block sequence may not be used as an implicit map key");
            else if ("indent" in key && key.indent !== bm.indent)
              onError(offset, "BAD_INDENT", startColMsg);
          }
          if (!keyProps.anchor && !keyProps.tag && !sep2) {
            commentEnd = keyProps.end;
            if (keyProps.comment) {
              if (map.comment)
                map.comment += "\n" + keyProps.comment;
              else
                map.comment = keyProps.comment;
            }
            continue;
          }
          if (keyProps.newlineAfterProp || utilContainsNewline.containsNewline(key)) {
            onError(key ?? start[start.length - 1], "MULTILINE_IMPLICIT_KEY", "Implicit keys need to be on a single line");
          }
        } else if (keyProps.found?.indent !== bm.indent) {
          onError(offset, "BAD_INDENT", startColMsg);
        }
        ctx.atKey = true;
        const keyStart = keyProps.end;
        const keyNode = key ? composeNode(ctx, key, keyProps, onError) : composeEmptyNode(ctx, keyStart, start, null, keyProps, onError);
        if (ctx.schema.compat)
          utilFlowIndentCheck.flowIndentCheck(bm.indent, key, onError);
        ctx.atKey = false;
        if (utilMapIncludes.mapIncludes(ctx, map.items, keyNode))
          onError(keyStart, "DUPLICATE_KEY", "Map keys must be unique");
        const valueProps = resolveProps.resolveProps(sep2 ?? [], {
          indicator: "map-value-ind",
          next: value,
          offset: keyNode.range[2],
          onError,
          parentIndent: bm.indent,
          startOnNewline: !key || key.type === "block-scalar"
        });
        offset = valueProps.end;
        if (valueProps.found) {
          if (implicitKey) {
            if (value?.type === "block-map" && !valueProps.hasNewline)
              onError(offset, "BLOCK_AS_IMPLICIT_KEY", "Nested mappings are not allowed in compact mappings");
            if (ctx.options.strict && keyProps.start < valueProps.found.offset - 1024)
              onError(keyNode.range, "KEY_OVER_1024_CHARS", "The : indicator must be at most 1024 chars after the start of an implicit block mapping key");
          }
          const valueNode = value ? composeNode(ctx, value, valueProps, onError) : composeEmptyNode(ctx, offset, sep2, null, valueProps, onError);
          if (ctx.schema.compat)
            utilFlowIndentCheck.flowIndentCheck(bm.indent, value, onError);
          offset = valueNode.range[2];
          const pair = new Pair.Pair(keyNode, valueNode);
          if (ctx.options.keepSourceTokens)
            pair.srcToken = collItem;
          map.items.push(pair);
        } else {
          if (implicitKey)
            onError(keyNode.range, "MISSING_CHAR", "Implicit map keys need to be followed by map values");
          if (valueProps.comment) {
            if (keyNode.comment)
              keyNode.comment += "\n" + valueProps.comment;
            else
              keyNode.comment = valueProps.comment;
          }
          const pair = new Pair.Pair(keyNode);
          if (ctx.options.keepSourceTokens)
            pair.srcToken = collItem;
          map.items.push(pair);
        }
      }
      if (commentEnd && commentEnd < offset)
        onError(commentEnd, "IMPOSSIBLE", "Map comment with trailing content");
      map.range = [bm.offset, offset, commentEnd ?? offset];
      return map;
    }
    exports.resolveBlockMap = resolveBlockMap;
  }
});

// ../../node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/compose/resolve-block-seq.js
var require_resolve_block_seq = __commonJS({
  "../../node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/compose/resolve-block-seq.js"(exports) {
    "use strict";
    var YAMLSeq2 = require_YAMLSeq();
    var resolveProps = require_resolve_props();
    var utilFlowIndentCheck = require_util_flow_indent_check();
    function resolveBlockSeq({ composeNode, composeEmptyNode }, ctx, bs, onError, tag) {
      const NodeClass = tag?.nodeClass ?? YAMLSeq2.YAMLSeq;
      const seq = new NodeClass(ctx.schema);
      if (ctx.atRoot)
        ctx.atRoot = false;
      if (ctx.atKey)
        ctx.atKey = false;
      let offset = bs.offset;
      let commentEnd = null;
      for (const { start, value } of bs.items) {
        const props = resolveProps.resolveProps(start, {
          indicator: "seq-item-ind",
          next: value,
          offset,
          onError,
          parentIndent: bs.indent,
          startOnNewline: true
        });
        if (!props.found) {
          if (props.anchor || props.tag || value) {
            if (value?.type === "block-seq")
              onError(props.end, "BAD_INDENT", "All sequence items must start at the same column");
            else
              onError(offset, "MISSING_CHAR", "Sequence item without - indicator");
          } else {
            commentEnd = props.end;
            if (props.comment)
              seq.comment = props.comment;
            continue;
          }
        }
        const node = value ? composeNode(ctx, value, props, onError) : composeEmptyNode(ctx, props.end, start, null, props, onError);
        if (ctx.schema.compat)
          utilFlowIndentCheck.flowIndentCheck(bs.indent, value, onError);
        offset = node.range[2];
        seq.items.push(node);
      }
      seq.range = [bs.offset, offset, commentEnd ?? offset];
      return seq;
    }
    exports.resolveBlockSeq = resolveBlockSeq;
  }
});

// ../../node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/compose/resolve-end.js
var require_resolve_end = __commonJS({
  "../../node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/compose/resolve-end.js"(exports) {
    "use strict";
    function resolveEnd(end, offset, reqSpace, onError) {
      let comment = "";
      if (end) {
        let hasSpace = false;
        let sep2 = "";
        for (const token of end) {
          const { source, type } = token;
          switch (type) {
            case "space":
              hasSpace = true;
              break;
            case "comment": {
              if (reqSpace && !hasSpace)
                onError(token, "MISSING_CHAR", "Comments must be separated from other tokens by white space characters");
              const cb = source.substring(1) || " ";
              if (!comment)
                comment = cb;
              else
                comment += sep2 + cb;
              sep2 = "";
              break;
            }
            case "newline":
              if (comment)
                sep2 += source;
              hasSpace = true;
              break;
            default:
              onError(token, "UNEXPECTED_TOKEN", `Unexpected ${type} at node end`);
          }
          offset += source.length;
        }
      }
      return { comment, offset };
    }
    exports.resolveEnd = resolveEnd;
  }
});

// ../../node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/compose/resolve-flow-collection.js
var require_resolve_flow_collection = __commonJS({
  "../../node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/compose/resolve-flow-collection.js"(exports) {
    "use strict";
    var identity = require_identity();
    var Pair = require_Pair();
    var YAMLMap = require_YAMLMap();
    var YAMLSeq2 = require_YAMLSeq();
    var resolveEnd = require_resolve_end();
    var resolveProps = require_resolve_props();
    var utilContainsNewline = require_util_contains_newline();
    var utilMapIncludes = require_util_map_includes();
    var blockMsg = "Block collections are not allowed within flow collections";
    var isBlock = (token) => token && (token.type === "block-map" || token.type === "block-seq");
    function resolveFlowCollection({ composeNode, composeEmptyNode }, ctx, fc, onError, tag) {
      const isMap = fc.start.source === "{";
      const fcName = isMap ? "flow map" : "flow sequence";
      const NodeClass = tag?.nodeClass ?? (isMap ? YAMLMap.YAMLMap : YAMLSeq2.YAMLSeq);
      const coll = new NodeClass(ctx.schema);
      coll.flow = true;
      const atRoot = ctx.atRoot;
      if (atRoot)
        ctx.atRoot = false;
      if (ctx.atKey)
        ctx.atKey = false;
      let offset = fc.offset + fc.start.source.length;
      for (let i = 0; i < fc.items.length; ++i) {
        const collItem = fc.items[i];
        const { start, key, sep: sep2, value } = collItem;
        const props = resolveProps.resolveProps(start, {
          flow: fcName,
          indicator: "explicit-key-ind",
          next: key ?? sep2?.[0],
          offset,
          onError,
          parentIndent: fc.indent,
          startOnNewline: false
        });
        if (!props.found) {
          if (!props.anchor && !props.tag && !sep2 && !value) {
            if (i === 0 && props.comma)
              onError(props.comma, "UNEXPECTED_TOKEN", `Unexpected , in ${fcName}`);
            else if (i < fc.items.length - 1)
              onError(props.start, "UNEXPECTED_TOKEN", `Unexpected empty item in ${fcName}`);
            if (props.comment) {
              if (coll.comment)
                coll.comment += "\n" + props.comment;
              else
                coll.comment = props.comment;
            }
            offset = props.end;
            continue;
          }
          if (!isMap && ctx.options.strict && utilContainsNewline.containsNewline(key))
            onError(
              key,
              // checked by containsNewline()
              "MULTILINE_IMPLICIT_KEY",
              "Implicit keys of flow sequence pairs need to be on a single line"
            );
        }
        if (i === 0) {
          if (props.comma)
            onError(props.comma, "UNEXPECTED_TOKEN", `Unexpected , in ${fcName}`);
        } else {
          if (!props.comma)
            onError(props.start, "MISSING_CHAR", `Missing , between ${fcName} items`);
          if (props.comment) {
            let prevItemComment = "";
            loop: for (const st of start) {
              switch (st.type) {
                case "comma":
                case "space":
                  break;
                case "comment":
                  prevItemComment = st.source.substring(1);
                  break loop;
                default:
                  break loop;
              }
            }
            if (prevItemComment) {
              let prev = coll.items[coll.items.length - 1];
              if (identity.isPair(prev))
                prev = prev.value ?? prev.key;
              if (prev.comment)
                prev.comment += "\n" + prevItemComment;
              else
                prev.comment = prevItemComment;
              props.comment = props.comment.substring(prevItemComment.length + 1);
            }
          }
        }
        if (!isMap && !sep2 && !props.found) {
          const valueNode = value ? composeNode(ctx, value, props, onError) : composeEmptyNode(ctx, props.end, sep2, null, props, onError);
          coll.items.push(valueNode);
          offset = valueNode.range[2];
          if (isBlock(value))
            onError(valueNode.range, "BLOCK_IN_FLOW", blockMsg);
        } else {
          ctx.atKey = true;
          const keyStart = props.end;
          const keyNode = key ? composeNode(ctx, key, props, onError) : composeEmptyNode(ctx, keyStart, start, null, props, onError);
          if (isBlock(key))
            onError(keyNode.range, "BLOCK_IN_FLOW", blockMsg);
          ctx.atKey = false;
          const valueProps = resolveProps.resolveProps(sep2 ?? [], {
            flow: fcName,
            indicator: "map-value-ind",
            next: value,
            offset: keyNode.range[2],
            onError,
            parentIndent: fc.indent,
            startOnNewline: false
          });
          if (valueProps.found) {
            if (!isMap && !props.found && ctx.options.strict) {
              if (sep2)
                for (const st of sep2) {
                  if (st === valueProps.found)
                    break;
                  if (st.type === "newline") {
                    onError(st, "MULTILINE_IMPLICIT_KEY", "Implicit keys of flow sequence pairs need to be on a single line");
                    break;
                  }
                }
              if (props.start < valueProps.found.offset - 1024)
                onError(valueProps.found, "KEY_OVER_1024_CHARS", "The : indicator must be at most 1024 chars after the start of an implicit flow sequence key");
            }
          } else if (value) {
            if ("source" in value && value.source?.[0] === ":")
              onError(value, "MISSING_CHAR", `Missing space after : in ${fcName}`);
            else
              onError(valueProps.start, "MISSING_CHAR", `Missing , or : between ${fcName} items`);
          }
          const valueNode = value ? composeNode(ctx, value, valueProps, onError) : valueProps.found ? composeEmptyNode(ctx, valueProps.end, sep2, null, valueProps, onError) : null;
          if (valueNode) {
            if (isBlock(value))
              onError(valueNode.range, "BLOCK_IN_FLOW", blockMsg);
          } else if (valueProps.comment) {
            if (keyNode.comment)
              keyNode.comment += "\n" + valueProps.comment;
            else
              keyNode.comment = valueProps.comment;
          }
          const pair = new Pair.Pair(keyNode, valueNode);
          if (ctx.options.keepSourceTokens)
            pair.srcToken = collItem;
          if (isMap) {
            const map = coll;
            if (utilMapIncludes.mapIncludes(ctx, map.items, keyNode))
              onError(keyStart, "DUPLICATE_KEY", "Map keys must be unique");
            map.items.push(pair);
          } else {
            const map = new YAMLMap.YAMLMap(ctx.schema);
            map.flow = true;
            map.items.push(pair);
            const endRange = (valueNode ?? keyNode).range;
            map.range = [keyNode.range[0], endRange[1], endRange[2]];
            coll.items.push(map);
          }
          offset = valueNode ? valueNode.range[2] : valueProps.end;
        }
      }
      const expectedEnd = isMap ? "}" : "]";
      const [ce, ...ee] = fc.end;
      let cePos = offset;
      if (ce?.source === expectedEnd)
        cePos = ce.offset + ce.source.length;
      else {
        const name = fcName[0].toUpperCase() + fcName.substring(1);
        const msg = atRoot ? `${name} must end with a ${expectedEnd}` : `${name} in block collection must be sufficiently indented and end with a ${expectedEnd}`;
        onError(offset, atRoot ? "MISSING_CHAR" : "BAD_INDENT", msg);
        if (ce && ce.source.length !== 1)
          ee.unshift(ce);
      }
      if (ee.length > 0) {
        const end = resolveEnd.resolveEnd(ee, cePos, ctx.options.strict, onError);
        if (end.comment) {
          if (coll.comment)
            coll.comment += "\n" + end.comment;
          else
            coll.comment = end.comment;
        }
        coll.range = [fc.offset, cePos, end.offset];
      } else {
        coll.range = [fc.offset, cePos, cePos];
      }
      return coll;
    }
    exports.resolveFlowCollection = resolveFlowCollection;
  }
});

// ../../node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/compose/compose-collection.js
var require_compose_collection = __commonJS({
  "../../node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/compose/compose-collection.js"(exports) {
    "use strict";
    var identity = require_identity();
    var Scalar = require_Scalar();
    var YAMLMap = require_YAMLMap();
    var YAMLSeq2 = require_YAMLSeq();
    var resolveBlockMap = require_resolve_block_map();
    var resolveBlockSeq = require_resolve_block_seq();
    var resolveFlowCollection = require_resolve_flow_collection();
    function resolveCollection(CN, ctx, token, onError, tagName, tag) {
      const coll = token.type === "block-map" ? resolveBlockMap.resolveBlockMap(CN, ctx, token, onError, tag) : token.type === "block-seq" ? resolveBlockSeq.resolveBlockSeq(CN, ctx, token, onError, tag) : resolveFlowCollection.resolveFlowCollection(CN, ctx, token, onError, tag);
      const Coll = coll.constructor;
      if (tagName === "!" || tagName === Coll.tagName) {
        coll.tag = Coll.tagName;
        return coll;
      }
      if (tagName)
        coll.tag = tagName;
      return coll;
    }
    function composeCollection(CN, ctx, token, props, onError) {
      const tagToken = props.tag;
      const tagName = !tagToken ? null : ctx.directives.tagName(tagToken.source, (msg) => onError(tagToken, "TAG_RESOLVE_FAILED", msg));
      if (token.type === "block-seq") {
        const { anchor, newlineAfterProp: nl } = props;
        const lastProp = anchor && tagToken ? anchor.offset > tagToken.offset ? anchor : tagToken : anchor ?? tagToken;
        if (lastProp && (!nl || nl.offset < lastProp.offset)) {
          const message = "Missing newline after block sequence props";
          onError(lastProp, "MISSING_CHAR", message);
        }
      }
      const expType = token.type === "block-map" ? "map" : token.type === "block-seq" ? "seq" : token.start.source === "{" ? "map" : "seq";
      if (!tagToken || !tagName || tagName === "!" || tagName === YAMLMap.YAMLMap.tagName && expType === "map" || tagName === YAMLSeq2.YAMLSeq.tagName && expType === "seq") {
        return resolveCollection(CN, ctx, token, onError, tagName);
      }
      let tag = ctx.schema.tags.find((t) => t.tag === tagName && t.collection === expType);
      if (!tag) {
        const kt = ctx.schema.knownTags[tagName];
        if (kt?.collection === expType) {
          ctx.schema.tags.push(Object.assign({}, kt, { default: false }));
          tag = kt;
        } else {
          if (kt) {
            onError(tagToken, "BAD_COLLECTION_TYPE", `${kt.tag} used for ${expType} collection, but expects ${kt.collection ?? "scalar"}`, true);
          } else {
            onError(tagToken, "TAG_RESOLVE_FAILED", `Unresolved tag: ${tagName}`, true);
          }
          return resolveCollection(CN, ctx, token, onError, tagName);
        }
      }
      const coll = resolveCollection(CN, ctx, token, onError, tagName, tag);
      const res = tag.resolve?.(coll, (msg) => onError(tagToken, "TAG_RESOLVE_FAILED", msg), ctx.options) ?? coll;
      const node = identity.isNode(res) ? res : new Scalar.Scalar(res);
      node.range = coll.range;
      node.tag = tagName;
      if (tag?.format)
        node.format = tag.format;
      return node;
    }
    exports.composeCollection = composeCollection;
  }
});

// ../../node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/compose/resolve-block-scalar.js
var require_resolve_block_scalar = __commonJS({
  "../../node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/compose/resolve-block-scalar.js"(exports) {
    "use strict";
    var Scalar = require_Scalar();
    function resolveBlockScalar(ctx, scalar, onError) {
      const start = scalar.offset;
      const header = parseBlockScalarHeader(scalar, ctx.options.strict, onError);
      if (!header)
        return { value: "", type: null, comment: "", range: [start, start, start] };
      const type = header.mode === ">" ? Scalar.Scalar.BLOCK_FOLDED : Scalar.Scalar.BLOCK_LITERAL;
      const lines = scalar.source ? splitLines(scalar.source) : [];
      let chompStart = lines.length;
      for (let i = lines.length - 1; i >= 0; --i) {
        const content = lines[i][1];
        if (content === "" || content === "\r")
          chompStart = i;
        else
          break;
      }
      if (chompStart === 0) {
        const value2 = header.chomp === "+" && lines.length > 0 ? "\n".repeat(Math.max(1, lines.length - 1)) : "";
        let end2 = start + header.length;
        if (scalar.source)
          end2 += scalar.source.length;
        return { value: value2, type, comment: header.comment, range: [start, end2, end2] };
      }
      let trimIndent = scalar.indent + header.indent;
      let offset = scalar.offset + header.length;
      let contentStart = 0;
      for (let i = 0; i < chompStart; ++i) {
        const [indent, content] = lines[i];
        if (content === "" || content === "\r") {
          if (header.indent === 0 && indent.length > trimIndent)
            trimIndent = indent.length;
        } else {
          if (indent.length < trimIndent) {
            const message = "Block scalars with more-indented leading empty lines must use an explicit indentation indicator";
            onError(offset + indent.length, "MISSING_CHAR", message);
          }
          if (header.indent === 0)
            trimIndent = indent.length;
          contentStart = i;
          if (trimIndent === 0 && !ctx.atRoot) {
            const message = "Block scalar values in collections must be indented";
            onError(offset, "BAD_INDENT", message);
          }
          break;
        }
        offset += indent.length + content.length + 1;
      }
      for (let i = lines.length - 1; i >= chompStart; --i) {
        if (lines[i][0].length > trimIndent)
          chompStart = i + 1;
      }
      let value = "";
      let sep2 = "";
      let prevMoreIndented = false;
      for (let i = 0; i < contentStart; ++i)
        value += lines[i][0].slice(trimIndent) + "\n";
      for (let i = contentStart; i < chompStart; ++i) {
        let [indent, content] = lines[i];
        offset += indent.length + content.length + 1;
        const crlf = content[content.length - 1] === "\r";
        if (crlf)
          content = content.slice(0, -1);
        if (content && indent.length < trimIndent) {
          const src = header.indent ? "explicit indentation indicator" : "first line";
          const message = `Block scalar lines must not be less indented than their ${src}`;
          onError(offset - content.length - (crlf ? 2 : 1), "BAD_INDENT", message);
          indent = "";
        }
        if (type === Scalar.Scalar.BLOCK_LITERAL) {
          value += sep2 + indent.slice(trimIndent) + content;
          sep2 = "\n";
        } else if (indent.length > trimIndent || content[0] === "	") {
          if (sep2 === " ")
            sep2 = "\n";
          else if (!prevMoreIndented && sep2 === "\n")
            sep2 = "\n\n";
          value += sep2 + indent.slice(trimIndent) + content;
          sep2 = "\n";
          prevMoreIndented = true;
        } else if (content === "") {
          if (sep2 === "\n")
            value += "\n";
          else
            sep2 = "\n";
        } else {
          value += sep2 + content;
          sep2 = " ";
          prevMoreIndented = false;
        }
      }
      switch (header.chomp) {
        case "-":
          break;
        case "+":
          for (let i = chompStart; i < lines.length; ++i)
            value += "\n" + lines[i][0].slice(trimIndent);
          if (value[value.length - 1] !== "\n")
            value += "\n";
          break;
        default:
          value += "\n";
      }
      const end = start + header.length + scalar.source.length;
      return { value, type, comment: header.comment, range: [start, end, end] };
    }
    function parseBlockScalarHeader({ offset, props }, strict, onError) {
      if (props[0].type !== "block-scalar-header") {
        onError(props[0], "IMPOSSIBLE", "Block scalar header not found");
        return null;
      }
      const { source } = props[0];
      const mode = source[0];
      let indent = 0;
      let chomp = "";
      let error = -1;
      for (let i = 1; i < source.length; ++i) {
        const ch = source[i];
        if (!chomp && (ch === "-" || ch === "+"))
          chomp = ch;
        else {
          const n = Number(ch);
          if (!indent && n)
            indent = n;
          else if (error === -1)
            error = offset + i;
        }
      }
      if (error !== -1)
        onError(error, "UNEXPECTED_TOKEN", `Block scalar header includes extra characters: ${source}`);
      let hasSpace = false;
      let comment = "";
      let length = source.length;
      for (let i = 1; i < props.length; ++i) {
        const token = props[i];
        switch (token.type) {
          case "space":
            hasSpace = true;
          // fallthrough
          case "newline":
            length += token.source.length;
            break;
          case "comment":
            if (strict && !hasSpace) {
              const message = "Comments must be separated from other tokens by white space characters";
              onError(token, "MISSING_CHAR", message);
            }
            length += token.source.length;
            comment = token.source.substring(1);
            break;
          case "error":
            onError(token, "UNEXPECTED_TOKEN", token.message);
            length += token.source.length;
            break;
          /* istanbul ignore next should not happen */
          default: {
            const message = `Unexpected token in block scalar header: ${token.type}`;
            onError(token, "UNEXPECTED_TOKEN", message);
            const ts = token.source;
            if (ts && typeof ts === "string")
              length += ts.length;
          }
        }
      }
      return { mode, indent, chomp, comment, length };
    }
    function splitLines(source) {
      const split = source.split(/\n( *)/);
      const first = split[0];
      const m = first.match(/^( *)/);
      const line0 = m?.[1] ? [m[1], first.slice(m[1].length)] : ["", first];
      const lines = [line0];
      for (let i = 1; i < split.length; i += 2)
        lines.push([split[i], split[i + 1]]);
      return lines;
    }
    exports.resolveBlockScalar = resolveBlockScalar;
  }
});

// ../../node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/compose/resolve-flow-scalar.js
var require_resolve_flow_scalar = __commonJS({
  "../../node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/compose/resolve-flow-scalar.js"(exports) {
    "use strict";
    var Scalar = require_Scalar();
    var resolveEnd = require_resolve_end();
    function resolveFlowScalar(scalar, strict, onError) {
      const { offset, type, source, end } = scalar;
      let _type;
      let value;
      const _onError = (rel, code, msg) => onError(offset + rel, code, msg);
      switch (type) {
        case "scalar":
          _type = Scalar.Scalar.PLAIN;
          value = plainValue(source, _onError);
          break;
        case "single-quoted-scalar":
          _type = Scalar.Scalar.QUOTE_SINGLE;
          value = singleQuotedValue(source, _onError);
          break;
        case "double-quoted-scalar":
          _type = Scalar.Scalar.QUOTE_DOUBLE;
          value = doubleQuotedValue(source, _onError);
          break;
        /* istanbul ignore next should not happen */
        default:
          onError(scalar, "UNEXPECTED_TOKEN", `Expected a flow scalar value, but found: ${type}`);
          return {
            value: "",
            type: null,
            comment: "",
            range: [offset, offset + source.length, offset + source.length]
          };
      }
      const valueEnd = offset + source.length;
      const re = resolveEnd.resolveEnd(end, valueEnd, strict, onError);
      return {
        value,
        type: _type,
        comment: re.comment,
        range: [offset, valueEnd, re.offset]
      };
    }
    function plainValue(source, onError) {
      let badChar = "";
      switch (source[0]) {
        /* istanbul ignore next should not happen */
        case "	":
          badChar = "a tab character";
          break;
        case ",":
          badChar = "flow indicator character ,";
          break;
        case "%":
          badChar = "directive indicator character %";
          break;
        case "|":
        case ">": {
          badChar = `block scalar indicator ${source[0]}`;
          break;
        }
        case "@":
        case "`": {
          badChar = `reserved character ${source[0]}`;
          break;
        }
      }
      if (badChar)
        onError(0, "BAD_SCALAR_START", `Plain value cannot start with ${badChar}`);
      return foldLines(source);
    }
    function singleQuotedValue(source, onError) {
      if (source[source.length - 1] !== "'" || source.length === 1)
        onError(source.length, "MISSING_CHAR", "Missing closing 'quote");
      return foldLines(source.slice(1, -1)).replace(/''/g, "'");
    }
    function foldLines(source) {
      let first, line;
      try {
        first = new RegExp("(.*?)(?<![ 	])[ 	]*\r?\n", "sy");
        line = new RegExp("[ 	]*(.*?)(?:(?<![ 	])[ 	]*)?\r?\n", "sy");
      } catch {
        first = /(.*?)[ \t]*\r?\n/sy;
        line = /[ \t]*(.*?)[ \t]*\r?\n/sy;
      }
      let match = first.exec(source);
      if (!match)
        return source;
      let res = match[1];
      let sep2 = " ";
      let pos = first.lastIndex;
      line.lastIndex = pos;
      while (match = line.exec(source)) {
        if (match[1] === "") {
          if (sep2 === "\n")
            res += sep2;
          else
            sep2 = "\n";
        } else {
          res += sep2 + match[1];
          sep2 = " ";
        }
        pos = line.lastIndex;
      }
      const last = /[ \t]*(.*)/sy;
      last.lastIndex = pos;
      match = last.exec(source);
      return res + sep2 + (match?.[1] ?? "");
    }
    function doubleQuotedValue(source, onError) {
      let res = "";
      for (let i = 1; i < source.length - 1; ++i) {
        const ch = source[i];
        if (ch === "\r" && source[i + 1] === "\n")
          continue;
        if (ch === "\n") {
          const { fold, offset } = foldNewline(source, i);
          res += fold;
          i = offset;
        } else if (ch === "\\") {
          let next = source[++i];
          const cc = escapeCodes[next];
          if (cc)
            res += cc;
          else if (next === "\n") {
            next = source[i + 1];
            while (next === " " || next === "	")
              next = source[++i + 1];
          } else if (next === "\r" && source[i + 1] === "\n") {
            next = source[++i + 1];
            while (next === " " || next === "	")
              next = source[++i + 1];
          } else if (next === "x" || next === "u" || next === "U") {
            const length = next === "x" ? 2 : next === "u" ? 4 : 8;
            res += parseCharCode(source, i + 1, length, onError);
            i += length;
          } else {
            const raw = source.substr(i - 1, 2);
            onError(i - 1, "BAD_DQ_ESCAPE", `Invalid escape sequence ${raw}`);
            res += raw;
          }
        } else if (ch === " " || ch === "	") {
          const wsStart = i;
          let next = source[i + 1];
          while (next === " " || next === "	")
            next = source[++i + 1];
          if (next !== "\n" && !(next === "\r" && source[i + 2] === "\n"))
            res += i > wsStart ? source.slice(wsStart, i + 1) : ch;
        } else {
          res += ch;
        }
      }
      if (source[source.length - 1] !== '"' || source.length === 1)
        onError(source.length, "MISSING_CHAR", 'Missing closing "quote');
      return res;
    }
    function foldNewline(source, offset) {
      let fold = "";
      let ch = source[offset + 1];
      while (ch === " " || ch === "	" || ch === "\n" || ch === "\r") {
        if (ch === "\r" && source[offset + 2] !== "\n")
          break;
        if (ch === "\n")
          fold += "\n";
        offset += 1;
        ch = source[offset + 1];
      }
      if (!fold)
        fold = " ";
      return { fold, offset };
    }
    var escapeCodes = {
      "0": "\0",
      // null character
      a: "\x07",
      // bell character
      b: "\b",
      // backspace
      e: "\x1B",
      // escape character
      f: "\f",
      // form feed
      n: "\n",
      // line feed
      r: "\r",
      // carriage return
      t: "	",
      // horizontal tab
      v: "\v",
      // vertical tab
      N: "\x85",
      // Unicode next line
      _: "\xA0",
      // Unicode non-breaking space
      L: "\u2028",
      // Unicode line separator
      P: "\u2029",
      // Unicode paragraph separator
      " ": " ",
      '"': '"',
      "/": "/",
      "\\": "\\",
      "	": "	"
    };
    function parseCharCode(source, offset, length, onError) {
      const cc = source.substr(offset, length);
      const ok = cc.length === length && /^[0-9a-fA-F]+$/.test(cc);
      const code = ok ? parseInt(cc, 16) : NaN;
      try {
        return String.fromCodePoint(code);
      } catch {
        const raw = source.substr(offset - 2, length + 2);
        onError(offset - 2, "BAD_DQ_ESCAPE", `Invalid escape sequence ${raw}`);
        return raw;
      }
    }
    exports.resolveFlowScalar = resolveFlowScalar;
  }
});

// ../../node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/compose/compose-scalar.js
var require_compose_scalar = __commonJS({
  "../../node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/compose/compose-scalar.js"(exports) {
    "use strict";
    var identity = require_identity();
    var Scalar = require_Scalar();
    var resolveBlockScalar = require_resolve_block_scalar();
    var resolveFlowScalar = require_resolve_flow_scalar();
    function composeScalar(ctx, token, tagToken, onError) {
      const { value, type, comment, range } = token.type === "block-scalar" ? resolveBlockScalar.resolveBlockScalar(ctx, token, onError) : resolveFlowScalar.resolveFlowScalar(token, ctx.options.strict, onError);
      const tagName = tagToken ? ctx.directives.tagName(tagToken.source, (msg) => onError(tagToken, "TAG_RESOLVE_FAILED", msg)) : null;
      let tag;
      if (ctx.options.stringKeys && ctx.atKey) {
        tag = ctx.schema[identity.SCALAR];
      } else if (tagName)
        tag = findScalarTagByName(ctx.schema, value, tagName, tagToken, onError);
      else if (token.type === "scalar")
        tag = findScalarTagByTest(ctx, value, token, onError);
      else
        tag = ctx.schema[identity.SCALAR];
      let scalar;
      try {
        const res = tag.resolve(value, (msg) => onError(tagToken ?? token, "TAG_RESOLVE_FAILED", msg), ctx.options);
        scalar = identity.isScalar(res) ? res : new Scalar.Scalar(res);
      } catch (error) {
        const msg = error instanceof Error ? error.message : String(error);
        onError(tagToken ?? token, "TAG_RESOLVE_FAILED", msg);
        scalar = new Scalar.Scalar(value);
      }
      scalar.range = range;
      scalar.source = value;
      if (type)
        scalar.type = type;
      if (tagName)
        scalar.tag = tagName;
      if (tag.format)
        scalar.format = tag.format;
      if (comment)
        scalar.comment = comment;
      return scalar;
    }
    function findScalarTagByName(schema, value, tagName, tagToken, onError) {
      if (tagName === "!")
        return schema[identity.SCALAR];
      const matchWithTest = [];
      for (const tag of schema.tags) {
        if (!tag.collection && tag.tag === tagName) {
          if (tag.default && tag.test)
            matchWithTest.push(tag);
          else
            return tag;
        }
      }
      for (const tag of matchWithTest)
        if (tag.test?.test(value))
          return tag;
      const kt = schema.knownTags[tagName];
      if (kt && !kt.collection) {
        schema.tags.push(Object.assign({}, kt, { default: false, test: void 0 }));
        return kt;
      }
      onError(tagToken, "TAG_RESOLVE_FAILED", `Unresolved tag: ${tagName}`, tagName !== "tag:yaml.org,2002:str");
      return schema[identity.SCALAR];
    }
    function findScalarTagByTest({ atKey, directives, schema }, value, token, onError) {
      const tag = schema.tags.find((tag2) => (tag2.default === true || atKey && tag2.default === "key") && tag2.test?.test(value)) || schema[identity.SCALAR];
      if (schema.compat) {
        const compat = schema.compat.find((tag2) => tag2.default && tag2.test?.test(value)) ?? schema[identity.SCALAR];
        if (tag.tag !== compat.tag) {
          const ts = directives.tagString(tag.tag);
          const cs = directives.tagString(compat.tag);
          const msg = `Value may be parsed as either ${ts} or ${cs}`;
          onError(token, "TAG_RESOLVE_FAILED", msg, true);
        }
      }
      return tag;
    }
    exports.composeScalar = composeScalar;
  }
});

// ../../node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/compose/util-empty-scalar-position.js
var require_util_empty_scalar_position = __commonJS({
  "../../node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/compose/util-empty-scalar-position.js"(exports) {
    "use strict";
    function emptyScalarPosition(offset, before, pos) {
      if (before) {
        pos ?? (pos = before.length);
        for (let i = pos - 1; i >= 0; --i) {
          let st = before[i];
          switch (st.type) {
            case "space":
            case "comment":
            case "newline":
              offset -= st.source.length;
              continue;
          }
          st = before[++i];
          while (st?.type === "space") {
            offset += st.source.length;
            st = before[++i];
          }
          break;
        }
      }
      return offset;
    }
    exports.emptyScalarPosition = emptyScalarPosition;
  }
});

// ../../node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/compose/compose-node.js
var require_compose_node = __commonJS({
  "../../node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/compose/compose-node.js"(exports) {
    "use strict";
    var Alias = require_Alias();
    var identity = require_identity();
    var composeCollection = require_compose_collection();
    var composeScalar = require_compose_scalar();
    var resolveEnd = require_resolve_end();
    var utilEmptyScalarPosition = require_util_empty_scalar_position();
    var CN = { composeNode, composeEmptyNode };
    function composeNode(ctx, token, props, onError) {
      const atKey = ctx.atKey;
      const { spaceBefore, comment, anchor, tag } = props;
      let node;
      let isSrcToken = true;
      switch (token.type) {
        case "alias":
          node = composeAlias(ctx, token, onError);
          if (anchor || tag)
            onError(token, "ALIAS_PROPS", "An alias node must not specify any properties");
          break;
        case "scalar":
        case "single-quoted-scalar":
        case "double-quoted-scalar":
        case "block-scalar":
          node = composeScalar.composeScalar(ctx, token, tag, onError);
          if (anchor)
            node.anchor = anchor.source.substring(1);
          break;
        case "block-map":
        case "block-seq":
        case "flow-collection":
          try {
            node = composeCollection.composeCollection(CN, ctx, token, props, onError);
            if (anchor)
              node.anchor = anchor.source.substring(1);
          } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            onError(token, "RESOURCE_EXHAUSTION", message);
          }
          break;
        default: {
          const message = token.type === "error" ? token.message : `Unsupported token (type: ${token.type})`;
          onError(token, "UNEXPECTED_TOKEN", message);
          isSrcToken = false;
        }
      }
      node ?? (node = composeEmptyNode(ctx, token.offset, void 0, null, props, onError));
      if (anchor && node.anchor === "")
        onError(anchor, "BAD_ALIAS", "Anchor cannot be an empty string");
      if (atKey && ctx.options.stringKeys && (!identity.isScalar(node) || typeof node.value !== "string" || node.tag && node.tag !== "tag:yaml.org,2002:str")) {
        const msg = "With stringKeys, all keys must be strings";
        onError(tag ?? token, "NON_STRING_KEY", msg);
      }
      if (spaceBefore)
        node.spaceBefore = true;
      if (comment) {
        if (token.type === "scalar" && token.source === "")
          node.comment = comment;
        else
          node.commentBefore = comment;
      }
      if (ctx.options.keepSourceTokens && isSrcToken)
        node.srcToken = token;
      return node;
    }
    function composeEmptyNode(ctx, offset, before, pos, { spaceBefore, comment, anchor, tag, end }, onError) {
      const token = {
        type: "scalar",
        offset: utilEmptyScalarPosition.emptyScalarPosition(offset, before, pos),
        indent: -1,
        source: ""
      };
      const node = composeScalar.composeScalar(ctx, token, tag, onError);
      if (anchor) {
        node.anchor = anchor.source.substring(1);
        if (node.anchor === "")
          onError(anchor, "BAD_ALIAS", "Anchor cannot be an empty string");
      }
      if (spaceBefore)
        node.spaceBefore = true;
      if (comment) {
        node.comment = comment;
        node.range[2] = end;
      }
      return node;
    }
    function composeAlias({ options }, { offset, source, end }, onError) {
      const alias = new Alias.Alias(source.substring(1));
      if (alias.source === "")
        onError(offset, "BAD_ALIAS", "Alias cannot be an empty string");
      if (alias.source.endsWith(":"))
        onError(offset + source.length - 1, "BAD_ALIAS", "Alias ending in : is ambiguous", true);
      const valueEnd = offset + source.length;
      const re = resolveEnd.resolveEnd(end, valueEnd, options.strict, onError);
      alias.range = [offset, valueEnd, re.offset];
      if (re.comment)
        alias.comment = re.comment;
      return alias;
    }
    exports.composeEmptyNode = composeEmptyNode;
    exports.composeNode = composeNode;
  }
});

// ../../node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/compose/compose-doc.js
var require_compose_doc = __commonJS({
  "../../node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/compose/compose-doc.js"(exports) {
    "use strict";
    var Document = require_Document();
    var composeNode = require_compose_node();
    var resolveEnd = require_resolve_end();
    var resolveProps = require_resolve_props();
    function composeDoc(options, directives, { offset, start, value, end }, onError) {
      const opts = Object.assign({ _directives: directives }, options);
      const doc = new Document.Document(void 0, opts);
      const ctx = {
        atKey: false,
        atRoot: true,
        directives: doc.directives,
        options: doc.options,
        schema: doc.schema
      };
      const props = resolveProps.resolveProps(start, {
        indicator: "doc-start",
        next: value ?? end?.[0],
        offset,
        onError,
        parentIndent: 0,
        startOnNewline: true
      });
      if (props.found) {
        doc.directives.docStart = true;
        if (value && (value.type === "block-map" || value.type === "block-seq") && !props.hasNewline)
          onError(props.end, "MISSING_CHAR", "Block collection cannot start on same line with directives-end marker");
      }
      doc.contents = value ? composeNode.composeNode(ctx, value, props, onError) : composeNode.composeEmptyNode(ctx, props.end, start, null, props, onError);
      const contentEnd = doc.contents.range[2];
      const re = resolveEnd.resolveEnd(end, contentEnd, false, onError);
      if (re.comment)
        doc.comment = re.comment;
      doc.range = [offset, contentEnd, re.offset];
      return doc;
    }
    exports.composeDoc = composeDoc;
  }
});

// ../../node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/compose/composer.js
var require_composer = __commonJS({
  "../../node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/compose/composer.js"(exports) {
    "use strict";
    var node_process = __require("process");
    var directives = require_directives();
    var Document = require_Document();
    var errors = require_errors();
    var identity = require_identity();
    var composeDoc = require_compose_doc();
    var resolveEnd = require_resolve_end();
    function getErrorPos(src) {
      if (typeof src === "number")
        return [src, src + 1];
      if (Array.isArray(src))
        return src.length === 2 ? src : [src[0], src[1]];
      const { offset, source } = src;
      return [offset, offset + (typeof source === "string" ? source.length : 1)];
    }
    function parsePrelude(prelude) {
      let comment = "";
      let atComment = false;
      let afterEmptyLine = false;
      for (let i = 0; i < prelude.length; ++i) {
        const source = prelude[i];
        switch (source[0]) {
          case "#":
            comment += (comment === "" ? "" : afterEmptyLine ? "\n\n" : "\n") + (source.substring(1) || " ");
            atComment = true;
            afterEmptyLine = false;
            break;
          case "%":
            if (prelude[i + 1]?.[0] !== "#")
              i += 1;
            atComment = false;
            break;
          default:
            if (!atComment)
              afterEmptyLine = true;
            atComment = false;
        }
      }
      return { comment, afterEmptyLine };
    }
    var Composer = class {
      constructor(options = {}) {
        this.doc = null;
        this.atDirectives = false;
        this.prelude = [];
        this.errors = [];
        this.warnings = [];
        this.onError = (source, code, message, warning) => {
          const pos = getErrorPos(source);
          if (warning)
            this.warnings.push(new errors.YAMLWarning(pos, code, message));
          else
            this.errors.push(new errors.YAMLParseError(pos, code, message));
        };
        this.directives = new directives.Directives({ version: options.version || "1.2" });
        this.options = options;
      }
      decorate(doc, afterDoc) {
        const { comment, afterEmptyLine } = parsePrelude(this.prelude);
        if (comment) {
          const dc = doc.contents;
          if (afterDoc) {
            doc.comment = doc.comment ? `${doc.comment}
${comment}` : comment;
          } else if (afterEmptyLine || doc.directives.docStart || !dc) {
            doc.commentBefore = comment;
          } else if (identity.isCollection(dc) && !dc.flow && dc.items.length > 0) {
            let it = dc.items[0];
            if (identity.isPair(it))
              it = it.key;
            const cb = it.commentBefore;
            it.commentBefore = cb ? `${comment}
${cb}` : comment;
          } else {
            const cb = dc.commentBefore;
            dc.commentBefore = cb ? `${comment}
${cb}` : comment;
          }
        }
        if (afterDoc) {
          for (let i = 0; i < this.errors.length; ++i)
            doc.errors.push(this.errors[i]);
          for (let i = 0; i < this.warnings.length; ++i)
            doc.warnings.push(this.warnings[i]);
        } else {
          doc.errors = this.errors;
          doc.warnings = this.warnings;
        }
        this.prelude = [];
        this.errors = [];
        this.warnings = [];
      }
      /**
       * Current stream status information.
       *
       * Mostly useful at the end of input for an empty stream.
       */
      streamInfo() {
        return {
          comment: parsePrelude(this.prelude).comment,
          directives: this.directives,
          errors: this.errors,
          warnings: this.warnings
        };
      }
      /**
       * Compose tokens into documents.
       *
       * @param forceDoc - If the stream contains no document, still emit a final document including any comments and directives that would be applied to a subsequent document.
       * @param endOffset - Should be set if `forceDoc` is also set, to set the document range end and to indicate errors correctly.
       */
      *compose(tokens, forceDoc = false, endOffset = -1) {
        for (const token of tokens)
          yield* this.next(token);
        yield* this.end(forceDoc, endOffset);
      }
      /** Advance the composer by one CST token. */
      *next(token) {
        if (node_process.env.LOG_STREAM)
          console.dir(token, { depth: null });
        switch (token.type) {
          case "directive":
            this.directives.add(token.source, (offset, message, warning) => {
              const pos = getErrorPos(token);
              pos[0] += offset;
              this.onError(pos, "BAD_DIRECTIVE", message, warning);
            });
            this.prelude.push(token.source);
            this.atDirectives = true;
            break;
          case "document": {
            const doc = composeDoc.composeDoc(this.options, this.directives, token, this.onError);
            if (this.atDirectives && !doc.directives.docStart)
              this.onError(token, "MISSING_CHAR", "Missing directives-end/doc-start indicator line");
            this.decorate(doc, false);
            if (this.doc)
              yield this.doc;
            this.doc = doc;
            this.atDirectives = false;
            break;
          }
          case "byte-order-mark":
          case "space":
            break;
          case "comment":
          case "newline":
            this.prelude.push(token.source);
            break;
          case "error": {
            const msg = token.source ? `${token.message}: ${JSON.stringify(token.source)}` : token.message;
            const error = new errors.YAMLParseError(getErrorPos(token), "UNEXPECTED_TOKEN", msg);
            if (this.atDirectives || !this.doc)
              this.errors.push(error);
            else
              this.doc.errors.push(error);
            break;
          }
          case "doc-end": {
            if (!this.doc) {
              const msg = "Unexpected doc-end without preceding document";
              this.errors.push(new errors.YAMLParseError(getErrorPos(token), "UNEXPECTED_TOKEN", msg));
              break;
            }
            this.doc.directives.docEnd = true;
            const end = resolveEnd.resolveEnd(token.end, token.offset + token.source.length, this.doc.options.strict, this.onError);
            this.decorate(this.doc, true);
            if (end.comment) {
              const dc = this.doc.comment;
              this.doc.comment = dc ? `${dc}
${end.comment}` : end.comment;
            }
            this.doc.range[2] = end.offset;
            break;
          }
          default:
            this.errors.push(new errors.YAMLParseError(getErrorPos(token), "UNEXPECTED_TOKEN", `Unsupported token ${token.type}`));
        }
      }
      /**
       * Call at end of input to yield any remaining document.
       *
       * @param forceDoc - If the stream contains no document, still emit a final document including any comments and directives that would be applied to a subsequent document.
       * @param endOffset - Should be set if `forceDoc` is also set, to set the document range end and to indicate errors correctly.
       */
      *end(forceDoc = false, endOffset = -1) {
        if (this.doc) {
          this.decorate(this.doc, true);
          yield this.doc;
          this.doc = null;
        } else if (forceDoc) {
          const opts = Object.assign({ _directives: this.directives }, this.options);
          const doc = new Document.Document(void 0, opts);
          if (this.atDirectives)
            this.onError(endOffset, "MISSING_CHAR", "Missing directives-end indicator line");
          doc.range = [0, endOffset, endOffset];
          this.decorate(doc, false);
          yield doc;
        }
      }
    };
    exports.Composer = Composer;
  }
});

// ../../node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/parse/cst-scalar.js
var require_cst_scalar = __commonJS({
  "../../node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/parse/cst-scalar.js"(exports) {
    "use strict";
    var resolveBlockScalar = require_resolve_block_scalar();
    var resolveFlowScalar = require_resolve_flow_scalar();
    var errors = require_errors();
    var stringifyString = require_stringifyString();
    function resolveAsScalar(token, strict = true, onError) {
      if (token) {
        const _onError = (pos, code, message) => {
          const offset = typeof pos === "number" ? pos : Array.isArray(pos) ? pos[0] : pos.offset;
          if (onError)
            onError(offset, code, message);
          else
            throw new errors.YAMLParseError([offset, offset + 1], code, message);
        };
        switch (token.type) {
          case "scalar":
          case "single-quoted-scalar":
          case "double-quoted-scalar":
            return resolveFlowScalar.resolveFlowScalar(token, strict, _onError);
          case "block-scalar":
            return resolveBlockScalar.resolveBlockScalar({ options: { strict } }, token, _onError);
        }
      }
      return null;
    }
    function createScalarToken(value, context) {
      const { implicitKey = false, indent, inFlow = false, offset = -1, type = "PLAIN" } = context;
      const source = stringifyString.stringifyString({ type, value }, {
        implicitKey,
        indent: indent > 0 ? " ".repeat(indent) : "",
        inFlow,
        options: { blockQuote: true, lineWidth: -1 }
      });
      const end = context.end ?? [
        { type: "newline", offset: -1, indent, source: "\n" }
      ];
      switch (source[0]) {
        case "|":
        case ">": {
          const he = source.indexOf("\n");
          const head = source.substring(0, he);
          const body = source.substring(he + 1) + "\n";
          const props = [
            { type: "block-scalar-header", offset, indent, source: head }
          ];
          if (!addEndtoBlockProps(props, end))
            props.push({ type: "newline", offset: -1, indent, source: "\n" });
          return { type: "block-scalar", offset, indent, props, source: body };
        }
        case '"':
          return { type: "double-quoted-scalar", offset, indent, source, end };
        case "'":
          return { type: "single-quoted-scalar", offset, indent, source, end };
        default:
          return { type: "scalar", offset, indent, source, end };
      }
    }
    function setScalarValue(token, value, context = {}) {
      let { afterKey = false, implicitKey = false, inFlow = false, type } = context;
      let indent = "indent" in token ? token.indent : null;
      if (afterKey && typeof indent === "number")
        indent += 2;
      if (!type)
        switch (token.type) {
          case "single-quoted-scalar":
            type = "QUOTE_SINGLE";
            break;
          case "double-quoted-scalar":
            type = "QUOTE_DOUBLE";
            break;
          case "block-scalar": {
            const header = token.props[0];
            if (header.type !== "block-scalar-header")
              throw new Error("Invalid block scalar header");
            type = header.source[0] === ">" ? "BLOCK_FOLDED" : "BLOCK_LITERAL";
            break;
          }
          default:
            type = "PLAIN";
        }
      const source = stringifyString.stringifyString({ type, value }, {
        implicitKey: implicitKey || indent === null,
        indent: indent !== null && indent > 0 ? " ".repeat(indent) : "",
        inFlow,
        options: { blockQuote: true, lineWidth: -1 }
      });
      switch (source[0]) {
        case "|":
        case ">":
          setBlockScalarValue(token, source);
          break;
        case '"':
          setFlowScalarValue(token, source, "double-quoted-scalar");
          break;
        case "'":
          setFlowScalarValue(token, source, "single-quoted-scalar");
          break;
        default:
          setFlowScalarValue(token, source, "scalar");
      }
    }
    function setBlockScalarValue(token, source) {
      const he = source.indexOf("\n");
      const head = source.substring(0, he);
      const body = source.substring(he + 1) + "\n";
      if (token.type === "block-scalar") {
        const header = token.props[0];
        if (header.type !== "block-scalar-header")
          throw new Error("Invalid block scalar header");
        header.source = head;
        token.source = body;
      } else {
        const { offset } = token;
        const indent = "indent" in token ? token.indent : -1;
        const props = [
          { type: "block-scalar-header", offset, indent, source: head }
        ];
        if (!addEndtoBlockProps(props, "end" in token ? token.end : void 0))
          props.push({ type: "newline", offset: -1, indent, source: "\n" });
        for (const key of Object.keys(token))
          if (key !== "type" && key !== "offset")
            delete token[key];
        Object.assign(token, { type: "block-scalar", indent, props, source: body });
      }
    }
    function addEndtoBlockProps(props, end) {
      if (end)
        for (const st of end)
          switch (st.type) {
            case "space":
            case "comment":
              props.push(st);
              break;
            case "newline":
              props.push(st);
              return true;
          }
      return false;
    }
    function setFlowScalarValue(token, source, type) {
      switch (token.type) {
        case "scalar":
        case "double-quoted-scalar":
        case "single-quoted-scalar":
          token.type = type;
          token.source = source;
          break;
        case "block-scalar": {
          const end = token.props.slice(1);
          let oa = source.length;
          if (token.props[0].type === "block-scalar-header")
            oa -= token.props[0].source.length;
          for (const tok of end)
            tok.offset += oa;
          delete token.props;
          Object.assign(token, { type, source, end });
          break;
        }
        case "block-map":
        case "block-seq": {
          const offset = token.offset + source.length;
          const nl = { type: "newline", offset, indent: token.indent, source: "\n" };
          delete token.items;
          Object.assign(token, { type, source, end: [nl] });
          break;
        }
        default: {
          const indent = "indent" in token ? token.indent : -1;
          const end = "end" in token && Array.isArray(token.end) ? token.end.filter((st) => st.type === "space" || st.type === "comment" || st.type === "newline") : [];
          for (const key of Object.keys(token))
            if (key !== "type" && key !== "offset")
              delete token[key];
          Object.assign(token, { type, indent, source, end });
        }
      }
    }
    exports.createScalarToken = createScalarToken;
    exports.resolveAsScalar = resolveAsScalar;
    exports.setScalarValue = setScalarValue;
  }
});

// ../../node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/parse/cst-stringify.js
var require_cst_stringify = __commonJS({
  "../../node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/parse/cst-stringify.js"(exports) {
    "use strict";
    var stringify = (cst) => "type" in cst ? stringifyToken(cst) : stringifyItem(cst);
    function stringifyToken(token) {
      switch (token.type) {
        case "block-scalar": {
          let res = "";
          for (const tok of token.props)
            res += stringifyToken(tok);
          return res + token.source;
        }
        case "block-map":
        case "block-seq": {
          let res = "";
          for (const item of token.items)
            res += stringifyItem(item);
          return res;
        }
        case "flow-collection": {
          let res = token.start.source;
          for (const item of token.items)
            res += stringifyItem(item);
          for (const st of token.end)
            res += st.source;
          return res;
        }
        case "document": {
          let res = stringifyItem(token);
          if (token.end)
            for (const st of token.end)
              res += st.source;
          return res;
        }
        default: {
          let res = token.source;
          if ("end" in token && token.end)
            for (const st of token.end)
              res += st.source;
          return res;
        }
      }
    }
    function stringifyItem({ start, key, sep: sep2, value }) {
      let res = "";
      for (const st of start)
        res += st.source;
      if (key)
        res += stringifyToken(key);
      if (sep2)
        for (const st of sep2)
          res += st.source;
      if (value)
        res += stringifyToken(value);
      return res;
    }
    exports.stringify = stringify;
  }
});

// ../../node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/parse/cst-visit.js
var require_cst_visit = __commonJS({
  "../../node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/parse/cst-visit.js"(exports) {
    "use strict";
    var BREAK = Symbol("break visit");
    var SKIP2 = Symbol("skip children");
    var REMOVE = Symbol("remove item");
    function visit(cst, visitor) {
      if ("type" in cst && cst.type === "document")
        cst = { start: cst.start, value: cst.value };
      _visit(Object.freeze([]), cst, visitor);
    }
    visit.BREAK = BREAK;
    visit.SKIP = SKIP2;
    visit.REMOVE = REMOVE;
    visit.itemAtPath = (cst, path) => {
      let item = cst;
      for (const [field, index] of path) {
        const tok = item?.[field];
        if (tok && "items" in tok) {
          item = tok.items[index];
        } else
          return void 0;
      }
      return item;
    };
    visit.parentCollection = (cst, path) => {
      const parent = visit.itemAtPath(cst, path.slice(0, -1));
      const field = path[path.length - 1][0];
      const coll = parent?.[field];
      if (coll && "items" in coll)
        return coll;
      throw new Error("Parent collection not found");
    };
    function _visit(path, item, visitor) {
      let ctrl = visitor(item, path);
      if (typeof ctrl === "symbol")
        return ctrl;
      for (const field of ["key", "value"]) {
        const token = item[field];
        if (token && "items" in token) {
          for (let i = 0; i < token.items.length; ++i) {
            const ci = _visit(Object.freeze(path.concat([[field, i]])), token.items[i], visitor);
            if (typeof ci === "number")
              i = ci - 1;
            else if (ci === BREAK)
              return BREAK;
            else if (ci === REMOVE) {
              token.items.splice(i, 1);
              i -= 1;
            }
          }
          if (typeof ctrl === "function" && field === "key")
            ctrl = ctrl(item, path);
        }
      }
      return typeof ctrl === "function" ? ctrl(item, path) : ctrl;
    }
    exports.visit = visit;
  }
});

// ../../node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/parse/cst.js
var require_cst = __commonJS({
  "../../node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/parse/cst.js"(exports) {
    "use strict";
    var cstScalar = require_cst_scalar();
    var cstStringify = require_cst_stringify();
    var cstVisit = require_cst_visit();
    var BOM = "\uFEFF";
    var DOCUMENT = "";
    var FLOW_END = "";
    var SCALAR = "";
    var isCollection = (token) => !!token && "items" in token;
    var isScalar = (token) => !!token && (token.type === "scalar" || token.type === "single-quoted-scalar" || token.type === "double-quoted-scalar" || token.type === "block-scalar");
    function prettyToken(token) {
      switch (token) {
        case BOM:
          return "<BOM>";
        case DOCUMENT:
          return "<DOC>";
        case FLOW_END:
          return "<FLOW_END>";
        case SCALAR:
          return "<SCALAR>";
        default:
          return JSON.stringify(token);
      }
    }
    function tokenType(source) {
      switch (source) {
        case BOM:
          return "byte-order-mark";
        case DOCUMENT:
          return "doc-mode";
        case FLOW_END:
          return "flow-error-end";
        case SCALAR:
          return "scalar";
        case "---":
          return "doc-start";
        case "...":
          return "doc-end";
        case "":
        case "\n":
        case "\r\n":
          return "newline";
        case "-":
          return "seq-item-ind";
        case "?":
          return "explicit-key-ind";
        case ":":
          return "map-value-ind";
        case "{":
          return "flow-map-start";
        case "}":
          return "flow-map-end";
        case "[":
          return "flow-seq-start";
        case "]":
          return "flow-seq-end";
        case ",":
          return "comma";
      }
      switch (source[0]) {
        case " ":
        case "	":
          return "space";
        case "#":
          return "comment";
        case "%":
          return "directive-line";
        case "*":
          return "alias";
        case "&":
          return "anchor";
        case "!":
          return "tag";
        case "'":
          return "single-quoted-scalar";
        case '"':
          return "double-quoted-scalar";
        case "|":
        case ">":
          return "block-scalar-header";
      }
      return null;
    }
    exports.createScalarToken = cstScalar.createScalarToken;
    exports.resolveAsScalar = cstScalar.resolveAsScalar;
    exports.setScalarValue = cstScalar.setScalarValue;
    exports.stringify = cstStringify.stringify;
    exports.visit = cstVisit.visit;
    exports.BOM = BOM;
    exports.DOCUMENT = DOCUMENT;
    exports.FLOW_END = FLOW_END;
    exports.SCALAR = SCALAR;
    exports.isCollection = isCollection;
    exports.isScalar = isScalar;
    exports.prettyToken = prettyToken;
    exports.tokenType = tokenType;
  }
});

// ../../node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/parse/lexer.js
var require_lexer = __commonJS({
  "../../node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/parse/lexer.js"(exports) {
    "use strict";
    var cst = require_cst();
    function isEmpty(ch) {
      switch (ch) {
        case void 0:
        case " ":
        case "\n":
        case "\r":
        case "	":
          return true;
        default:
          return false;
      }
    }
    var hexDigits = new Set("0123456789ABCDEFabcdef");
    var tagChars = new Set("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-#;/?:@&=+$_.!~*'()");
    var flowIndicatorChars = new Set(",[]{}");
    var invalidAnchorChars = new Set(" ,[]{}\n\r	");
    var isNotAnchorChar = (ch) => !ch || invalidAnchorChars.has(ch);
    var Lexer = class {
      constructor() {
        this.atEnd = false;
        this.blockScalarIndent = -1;
        this.blockScalarKeep = false;
        this.buffer = "";
        this.flowKey = false;
        this.flowLevel = 0;
        this.indentNext = 0;
        this.indentValue = 0;
        this.lineEndPos = null;
        this.next = null;
        this.pos = 0;
      }
      /**
       * Generate YAML tokens from the `source` string. If `incomplete`,
       * a part of the last line may be left as a buffer for the next call.
       *
       * @returns A generator of lexical tokens
       */
      *lex(source, incomplete = false) {
        if (source) {
          if (typeof source !== "string")
            throw TypeError("source is not a string");
          this.buffer = this.buffer ? this.buffer + source : source;
          this.lineEndPos = null;
        }
        this.atEnd = !incomplete;
        let next = this.next ?? "stream";
        while (next && (incomplete || this.hasChars(1)))
          next = yield* this.parseNext(next);
      }
      atLineEnd() {
        let i = this.pos;
        let ch = this.buffer[i];
        while (ch === " " || ch === "	")
          ch = this.buffer[++i];
        if (!ch || ch === "#" || ch === "\n")
          return true;
        if (ch === "\r")
          return this.buffer[i + 1] === "\n";
        return false;
      }
      charAt(n) {
        return this.buffer[this.pos + n];
      }
      continueScalar(offset) {
        let ch = this.buffer[offset];
        if (this.indentNext > 0) {
          let indent = 0;
          while (ch === " ")
            ch = this.buffer[++indent + offset];
          if (ch === "\r") {
            const next = this.buffer[indent + offset + 1];
            if (next === "\n" || !next && !this.atEnd)
              return offset + indent + 1;
          }
          return ch === "\n" || indent >= this.indentNext || !ch && !this.atEnd ? offset + indent : -1;
        }
        if (ch === "-" || ch === ".") {
          const dt = this.buffer.substr(offset, 3);
          if ((dt === "---" || dt === "...") && isEmpty(this.buffer[offset + 3]))
            return -1;
        }
        return offset;
      }
      getLine() {
        let end = this.lineEndPos;
        if (typeof end !== "number" || end !== -1 && end < this.pos) {
          end = this.buffer.indexOf("\n", this.pos);
          this.lineEndPos = end;
        }
        if (end === -1)
          return this.atEnd ? this.buffer.substring(this.pos) : null;
        if (this.buffer[end - 1] === "\r")
          end -= 1;
        return this.buffer.substring(this.pos, end);
      }
      hasChars(n) {
        return this.pos + n <= this.buffer.length;
      }
      setNext(state) {
        this.buffer = this.buffer.substring(this.pos);
        this.pos = 0;
        this.lineEndPos = null;
        this.next = state;
        return null;
      }
      peek(n) {
        return this.buffer.substr(this.pos, n);
      }
      *parseNext(next) {
        switch (next) {
          case "stream":
            return yield* this.parseStream();
          case "line-start":
            return yield* this.parseLineStart();
          case "block-start":
            return yield* this.parseBlockStart();
          case "doc":
            return yield* this.parseDocument();
          case "flow":
            return yield* this.parseFlowCollection();
          case "quoted-scalar":
            return yield* this.parseQuotedScalar();
          case "block-scalar":
            return yield* this.parseBlockScalar();
          case "plain-scalar":
            return yield* this.parsePlainScalar();
        }
      }
      *parseStream() {
        let line = this.getLine();
        if (line === null)
          return this.setNext("stream");
        if (line[0] === cst.BOM) {
          yield* this.pushCount(1);
          line = line.substring(1);
        }
        if (line[0] === "%") {
          let dirEnd = line.length;
          let cs = line.indexOf("#");
          while (cs !== -1) {
            const ch = line[cs - 1];
            if (ch === " " || ch === "	") {
              dirEnd = cs - 1;
              break;
            } else {
              cs = line.indexOf("#", cs + 1);
            }
          }
          while (true) {
            const ch = line[dirEnd - 1];
            if (ch === " " || ch === "	")
              dirEnd -= 1;
            else
              break;
          }
          const n = (yield* this.pushCount(dirEnd)) + (yield* this.pushSpaces(true));
          yield* this.pushCount(line.length - n);
          this.pushNewline();
          return "stream";
        }
        if (this.atLineEnd()) {
          const sp = yield* this.pushSpaces(true);
          yield* this.pushCount(line.length - sp);
          yield* this.pushNewline();
          return "stream";
        }
        yield cst.DOCUMENT;
        return yield* this.parseLineStart();
      }
      *parseLineStart() {
        const ch = this.charAt(0);
        if (!ch && !this.atEnd)
          return this.setNext("line-start");
        if (ch === "-" || ch === ".") {
          if (!this.atEnd && !this.hasChars(4))
            return this.setNext("line-start");
          const s = this.peek(3);
          if ((s === "---" || s === "...") && isEmpty(this.charAt(3))) {
            yield* this.pushCount(3);
            this.indentValue = 0;
            this.indentNext = 0;
            return s === "---" ? "doc" : "stream";
          }
        }
        this.indentValue = yield* this.pushSpaces(false);
        if (this.indentNext > this.indentValue && !isEmpty(this.charAt(1)))
          this.indentNext = this.indentValue;
        return yield* this.parseBlockStart();
      }
      *parseBlockStart() {
        const [ch0, ch1] = this.peek(2);
        if (!ch1 && !this.atEnd)
          return this.setNext("block-start");
        if ((ch0 === "-" || ch0 === "?" || ch0 === ":") && isEmpty(ch1)) {
          const n = (yield* this.pushCount(1)) + (yield* this.pushSpaces(true));
          this.indentNext = this.indentValue + 1;
          this.indentValue += n;
          return "block-start";
        }
        return "doc";
      }
      *parseDocument() {
        yield* this.pushSpaces(true);
        const line = this.getLine();
        if (line === null)
          return this.setNext("doc");
        let n = yield* this.pushIndicators();
        switch (line[n]) {
          case "#":
            yield* this.pushCount(line.length - n);
          // fallthrough
          case void 0:
            yield* this.pushNewline();
            return yield* this.parseLineStart();
          case "{":
          case "[":
            yield* this.pushCount(1);
            this.flowKey = false;
            this.flowLevel = 1;
            return "flow";
          case "}":
          case "]":
            yield* this.pushCount(1);
            return "doc";
          case "*":
            yield* this.pushUntil(isNotAnchorChar);
            return "doc";
          case '"':
          case "'":
            return yield* this.parseQuotedScalar();
          case "|":
          case ">":
            n += yield* this.parseBlockScalarHeader();
            n += yield* this.pushSpaces(true);
            yield* this.pushCount(line.length - n);
            yield* this.pushNewline();
            return yield* this.parseBlockScalar();
          default:
            return yield* this.parsePlainScalar();
        }
      }
      *parseFlowCollection() {
        let nl, sp;
        let indent = -1;
        do {
          nl = yield* this.pushNewline();
          if (nl > 0) {
            sp = yield* this.pushSpaces(false);
            this.indentValue = indent = sp;
          } else {
            sp = 0;
          }
          sp += yield* this.pushSpaces(true);
        } while (nl + sp > 0);
        const line = this.getLine();
        if (line === null)
          return this.setNext("flow");
        if (indent !== -1 && indent < this.indentNext && line[0] !== "#" || indent === 0 && (line.startsWith("---") || line.startsWith("...")) && isEmpty(line[3])) {
          const atFlowEndMarker = indent === this.indentNext - 1 && this.flowLevel === 1 && (line[0] === "]" || line[0] === "}");
          if (!atFlowEndMarker) {
            this.flowLevel = 0;
            yield cst.FLOW_END;
            return yield* this.parseLineStart();
          }
        }
        let n = 0;
        while (line[n] === ",") {
          n += yield* this.pushCount(1);
          n += yield* this.pushSpaces(true);
          this.flowKey = false;
        }
        n += yield* this.pushIndicators();
        switch (line[n]) {
          case void 0:
            return "flow";
          case "#":
            yield* this.pushCount(line.length - n);
            return "flow";
          case "{":
          case "[":
            yield* this.pushCount(1);
            this.flowKey = false;
            this.flowLevel += 1;
            return "flow";
          case "}":
          case "]":
            yield* this.pushCount(1);
            this.flowKey = true;
            this.flowLevel -= 1;
            return this.flowLevel ? "flow" : "doc";
          case "*":
            yield* this.pushUntil(isNotAnchorChar);
            return "flow";
          case '"':
          case "'":
            this.flowKey = true;
            return yield* this.parseQuotedScalar();
          case ":": {
            const next = this.charAt(1);
            if (this.flowKey || isEmpty(next) || next === ",") {
              this.flowKey = false;
              yield* this.pushCount(1);
              yield* this.pushSpaces(true);
              return "flow";
            }
          }
          // fallthrough
          default:
            this.flowKey = false;
            return yield* this.parsePlainScalar();
        }
      }
      *parseQuotedScalar() {
        const quote = this.charAt(0);
        let end = this.buffer.indexOf(quote, this.pos + 1);
        if (quote === "'") {
          while (end !== -1 && this.buffer[end + 1] === "'")
            end = this.buffer.indexOf("'", end + 2);
        } else {
          while (end !== -1) {
            let n = 0;
            while (this.buffer[end - 1 - n] === "\\")
              n += 1;
            if (n % 2 === 0)
              break;
            end = this.buffer.indexOf('"', end + 1);
          }
        }
        const qb = this.buffer.substring(0, end);
        let nl = qb.indexOf("\n", this.pos);
        if (nl !== -1) {
          while (nl !== -1) {
            const cs = this.continueScalar(nl + 1);
            if (cs === -1)
              break;
            nl = qb.indexOf("\n", cs);
          }
          if (nl !== -1) {
            end = nl - (qb[nl - 1] === "\r" ? 2 : 1);
          }
        }
        if (end === -1) {
          if (!this.atEnd)
            return this.setNext("quoted-scalar");
          end = this.buffer.length;
        }
        yield* this.pushToIndex(end + 1, false);
        return this.flowLevel ? "flow" : "doc";
      }
      *parseBlockScalarHeader() {
        this.blockScalarIndent = -1;
        this.blockScalarKeep = false;
        let i = this.pos;
        while (true) {
          const ch = this.buffer[++i];
          if (ch === "+")
            this.blockScalarKeep = true;
          else if (ch > "0" && ch <= "9")
            this.blockScalarIndent = Number(ch) - 1;
          else if (ch !== "-")
            break;
        }
        return yield* this.pushUntil((ch) => isEmpty(ch) || ch === "#");
      }
      *parseBlockScalar() {
        let nl = this.pos - 1;
        let indent = 0;
        let ch;
        loop: for (let i2 = this.pos; ch = this.buffer[i2]; ++i2) {
          switch (ch) {
            case " ":
              indent += 1;
              break;
            case "\n":
              nl = i2;
              indent = 0;
              break;
            case "\r": {
              const next = this.buffer[i2 + 1];
              if (!next && !this.atEnd)
                return this.setNext("block-scalar");
              if (next === "\n")
                break;
            }
            // fallthrough
            default:
              break loop;
          }
        }
        if (!ch && !this.atEnd)
          return this.setNext("block-scalar");
        if (indent >= this.indentNext) {
          if (this.blockScalarIndent === -1)
            this.indentNext = indent;
          else {
            this.indentNext = this.blockScalarIndent + (this.indentNext === 0 ? 1 : this.indentNext);
          }
          do {
            const cs = this.continueScalar(nl + 1);
            if (cs === -1)
              break;
            nl = this.buffer.indexOf("\n", cs);
          } while (nl !== -1);
          if (nl === -1) {
            if (!this.atEnd)
              return this.setNext("block-scalar");
            nl = this.buffer.length;
          }
        }
        let i = nl + 1;
        ch = this.buffer[i];
        while (ch === " ")
          ch = this.buffer[++i];
        if (ch === "	") {
          while (ch === "	" || ch === " " || ch === "\r" || ch === "\n")
            ch = this.buffer[++i];
          nl = i - 1;
        } else if (!this.blockScalarKeep) {
          do {
            let i2 = nl - 1;
            let ch2 = this.buffer[i2];
            if (ch2 === "\r")
              ch2 = this.buffer[--i2];
            const lastChar = i2;
            while (ch2 === " ")
              ch2 = this.buffer[--i2];
            if (ch2 === "\n" && i2 >= this.pos && i2 + 1 + indent > lastChar)
              nl = i2;
            else
              break;
          } while (true);
        }
        yield cst.SCALAR;
        yield* this.pushToIndex(nl + 1, true);
        return yield* this.parseLineStart();
      }
      *parsePlainScalar() {
        const inFlow = this.flowLevel > 0;
        let end = this.pos - 1;
        let i = this.pos - 1;
        let ch;
        while (ch = this.buffer[++i]) {
          if (ch === ":") {
            const next = this.buffer[i + 1];
            if (isEmpty(next) || inFlow && flowIndicatorChars.has(next))
              break;
            end = i;
          } else if (isEmpty(ch)) {
            let next = this.buffer[i + 1];
            if (ch === "\r") {
              if (next === "\n") {
                i += 1;
                ch = "\n";
                next = this.buffer[i + 1];
              } else
                end = i;
            }
            if (next === "#" || inFlow && flowIndicatorChars.has(next))
              break;
            if (ch === "\n") {
              const cs = this.continueScalar(i + 1);
              if (cs === -1)
                break;
              i = Math.max(i, cs - 2);
            }
          } else {
            if (inFlow && flowIndicatorChars.has(ch))
              break;
            end = i;
          }
        }
        if (!ch && !this.atEnd)
          return this.setNext("plain-scalar");
        yield cst.SCALAR;
        yield* this.pushToIndex(end + 1, true);
        return inFlow ? "flow" : "doc";
      }
      *pushCount(n) {
        if (n > 0) {
          yield this.buffer.substr(this.pos, n);
          this.pos += n;
          return n;
        }
        return 0;
      }
      *pushToIndex(i, allowEmpty) {
        const s = this.buffer.slice(this.pos, i);
        if (s) {
          yield s;
          this.pos += s.length;
          return s.length;
        } else if (allowEmpty)
          yield "";
        return 0;
      }
      *pushIndicators() {
        let n = 0;
        loop: while (true) {
          switch (this.charAt(0)) {
            case "!":
              n += yield* this.pushTag();
              n += yield* this.pushSpaces(true);
              continue loop;
            case "&":
              n += yield* this.pushUntil(isNotAnchorChar);
              n += yield* this.pushSpaces(true);
              continue loop;
            case "-":
            // this is an error
            case "?":
            // this is an error outside flow collections
            case ":": {
              const inFlow = this.flowLevel > 0;
              const ch1 = this.charAt(1);
              if (isEmpty(ch1) || inFlow && flowIndicatorChars.has(ch1)) {
                if (!inFlow)
                  this.indentNext = this.indentValue + 1;
                else if (this.flowKey)
                  this.flowKey = false;
                n += yield* this.pushCount(1);
                n += yield* this.pushSpaces(true);
                continue loop;
              }
            }
          }
          break loop;
        }
        return n;
      }
      *pushTag() {
        if (this.charAt(1) === "<") {
          let i = this.pos + 2;
          let ch = this.buffer[i];
          while (!isEmpty(ch) && ch !== ">")
            ch = this.buffer[++i];
          return yield* this.pushToIndex(ch === ">" ? i + 1 : i, false);
        } else {
          let i = this.pos + 1;
          let ch = this.buffer[i];
          while (ch) {
            if (tagChars.has(ch))
              ch = this.buffer[++i];
            else if (ch === "%" && hexDigits.has(this.buffer[i + 1]) && hexDigits.has(this.buffer[i + 2])) {
              ch = this.buffer[i += 3];
            } else
              break;
          }
          return yield* this.pushToIndex(i, false);
        }
      }
      *pushNewline() {
        const ch = this.buffer[this.pos];
        if (ch === "\n")
          return yield* this.pushCount(1);
        else if (ch === "\r" && this.charAt(1) === "\n")
          return yield* this.pushCount(2);
        else
          return 0;
      }
      *pushSpaces(allowTabs) {
        let i = this.pos - 1;
        let ch;
        do {
          ch = this.buffer[++i];
        } while (ch === " " || allowTabs && ch === "	");
        const n = i - this.pos;
        if (n > 0) {
          yield this.buffer.substr(this.pos, n);
          this.pos = i;
        }
        return n;
      }
      *pushUntil(test) {
        let i = this.pos;
        let ch = this.buffer[i];
        while (!test(ch))
          ch = this.buffer[++i];
        return yield* this.pushToIndex(i, false);
      }
    };
    exports.Lexer = Lexer;
  }
});

// ../../node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/parse/line-counter.js
var require_line_counter = __commonJS({
  "../../node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/parse/line-counter.js"(exports) {
    "use strict";
    var LineCounter = class {
      constructor() {
        this.lineStarts = [];
        this.addNewLine = (offset) => this.lineStarts.push(offset);
        this.linePos = (offset) => {
          let low = 0;
          let high = this.lineStarts.length;
          while (low < high) {
            const mid = low + high >> 1;
            if (this.lineStarts[mid] < offset)
              low = mid + 1;
            else
              high = mid;
          }
          if (this.lineStarts[low] === offset)
            return { line: low + 1, col: 1 };
          if (low === 0)
            return { line: 0, col: offset };
          const start = this.lineStarts[low - 1];
          return { line: low, col: offset - start + 1 };
        };
      }
    };
    exports.LineCounter = LineCounter;
  }
});

// ../../node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/parse/parser.js
var require_parser = __commonJS({
  "../../node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/parse/parser.js"(exports) {
    "use strict";
    var node_process = __require("process");
    var cst = require_cst();
    var lexer = require_lexer();
    function includesToken(list, type) {
      for (let i = 0; i < list.length; ++i)
        if (list[i].type === type)
          return true;
      return false;
    }
    function findNonEmptyIndex(list) {
      for (let i = 0; i < list.length; ++i) {
        switch (list[i].type) {
          case "space":
          case "comment":
          case "newline":
            break;
          default:
            return i;
        }
      }
      return -1;
    }
    function isFlowToken(token) {
      switch (token?.type) {
        case "alias":
        case "scalar":
        case "single-quoted-scalar":
        case "double-quoted-scalar":
        case "flow-collection":
          return true;
        default:
          return false;
      }
    }
    function getPrevProps(parent) {
      switch (parent.type) {
        case "document":
          return parent.start;
        case "block-map": {
          const it = parent.items[parent.items.length - 1];
          return it.sep ?? it.start;
        }
        case "block-seq":
          return parent.items[parent.items.length - 1].start;
        /* istanbul ignore next should not happen */
        default:
          return [];
      }
    }
    function getFirstKeyStartProps(prev) {
      if (prev.length === 0)
        return [];
      let i = prev.length;
      loop: while (--i >= 0) {
        switch (prev[i].type) {
          case "doc-start":
          case "explicit-key-ind":
          case "map-value-ind":
          case "seq-item-ind":
          case "newline":
            break loop;
        }
      }
      while (prev[++i]?.type === "space") {
      }
      return prev.splice(i, prev.length);
    }
    function arrayPushArray(target, source) {
      if (source.length < 1e5)
        Array.prototype.push.apply(target, source);
      else
        for (let i = 0; i < source.length; ++i)
          target.push(source[i]);
    }
    function fixFlowSeqItems(fc) {
      if (fc.start.type === "flow-seq-start") {
        for (const it of fc.items) {
          if (it.sep && !it.value && !includesToken(it.start, "explicit-key-ind") && !includesToken(it.sep, "map-value-ind")) {
            if (it.key)
              it.value = it.key;
            delete it.key;
            if (isFlowToken(it.value)) {
              if (it.value.end)
                arrayPushArray(it.value.end, it.sep);
              else
                it.value.end = it.sep;
            } else
              arrayPushArray(it.start, it.sep);
            delete it.sep;
          }
        }
      }
    }
    var Parser = class {
      /**
       * @param onNewLine - If defined, called separately with the start position of
       *   each new line (in `parse()`, including the start of input).
       */
      constructor(onNewLine) {
        this.atNewLine = true;
        this.atScalar = false;
        this.indent = 0;
        this.offset = 0;
        this.onKeyLine = false;
        this.stack = [];
        this.source = "";
        this.type = "";
        this.lexer = new lexer.Lexer();
        this.onNewLine = onNewLine;
      }
      /**
       * Parse `source` as a YAML stream.
       * If `incomplete`, a part of the last line may be left as a buffer for the next call.
       *
       * Errors are not thrown, but yielded as `{ type: 'error', message }` tokens.
       *
       * @returns A generator of tokens representing each directive, document, and other structure.
       */
      *parse(source, incomplete = false) {
        if (this.onNewLine && this.offset === 0)
          this.onNewLine(0);
        for (const lexeme of this.lexer.lex(source, incomplete))
          yield* this.next(lexeme);
        if (!incomplete)
          yield* this.end();
      }
      /**
       * Advance the parser by the `source` of one lexical token.
       */
      *next(source) {
        this.source = source;
        if (node_process.env.LOG_TOKENS)
          console.log("|", cst.prettyToken(source));
        if (this.atScalar) {
          this.atScalar = false;
          yield* this.step();
          this.offset += source.length;
          return;
        }
        const type = cst.tokenType(source);
        if (!type) {
          const message = `Not a YAML token: ${source}`;
          yield* this.pop({ type: "error", offset: this.offset, message, source });
          this.offset += source.length;
        } else if (type === "scalar") {
          this.atNewLine = false;
          this.atScalar = true;
          this.type = "scalar";
        } else {
          this.type = type;
          yield* this.step();
          switch (type) {
            case "newline":
              this.atNewLine = true;
              this.indent = 0;
              if (this.onNewLine)
                this.onNewLine(this.offset + source.length);
              break;
            case "space":
              if (this.atNewLine && source[0] === " ")
                this.indent += source.length;
              break;
            case "explicit-key-ind":
            case "map-value-ind":
            case "seq-item-ind":
              if (this.atNewLine)
                this.indent += source.length;
              break;
            case "doc-mode":
            case "flow-error-end":
              return;
            default:
              this.atNewLine = false;
          }
          this.offset += source.length;
        }
      }
      /** Call at end of input to push out any remaining constructions */
      *end() {
        while (this.stack.length > 0)
          yield* this.pop();
      }
      get sourceToken() {
        const st = {
          type: this.type,
          offset: this.offset,
          indent: this.indent,
          source: this.source
        };
        return st;
      }
      *step() {
        const top = this.peek(1);
        if (this.type === "doc-end" && top?.type !== "doc-end") {
          while (this.stack.length > 0)
            yield* this.pop();
          this.stack.push({
            type: "doc-end",
            offset: this.offset,
            source: this.source
          });
          return;
        }
        if (!top)
          return yield* this.stream();
        switch (top.type) {
          case "document":
            return yield* this.document(top);
          case "alias":
          case "scalar":
          case "single-quoted-scalar":
          case "double-quoted-scalar":
            return yield* this.scalar(top);
          case "block-scalar":
            return yield* this.blockScalar(top);
          case "block-map":
            return yield* this.blockMap(top);
          case "block-seq":
            return yield* this.blockSequence(top);
          case "flow-collection":
            return yield* this.flowCollection(top);
          case "doc-end":
            return yield* this.documentEnd(top);
        }
        yield* this.pop();
      }
      peek(n) {
        return this.stack[this.stack.length - n];
      }
      *pop(error) {
        const token = error ?? this.stack.pop();
        if (!token) {
          const message = "Tried to pop an empty stack";
          yield { type: "error", offset: this.offset, source: "", message };
        } else if (this.stack.length === 0) {
          yield token;
        } else {
          const top = this.peek(1);
          if (token.type === "block-scalar") {
            token.indent = "indent" in top ? top.indent : 0;
          } else if (token.type === "flow-collection" && top.type === "document") {
            token.indent = 0;
          }
          if (token.type === "flow-collection")
            fixFlowSeqItems(token);
          switch (top.type) {
            case "document":
              top.value = token;
              break;
            case "block-scalar":
              top.props.push(token);
              break;
            case "block-map": {
              const it = top.items[top.items.length - 1];
              if (it.value) {
                top.items.push({ start: [], key: token, sep: [] });
                this.onKeyLine = true;
                return;
              } else if (it.sep) {
                it.value = token;
              } else {
                Object.assign(it, { key: token, sep: [] });
                this.onKeyLine = !it.explicitKey;
                return;
              }
              break;
            }
            case "block-seq": {
              const it = top.items[top.items.length - 1];
              if (it.value)
                top.items.push({ start: [], value: token });
              else
                it.value = token;
              break;
            }
            case "flow-collection": {
              const it = top.items[top.items.length - 1];
              if (!it || it.value)
                top.items.push({ start: [], key: token, sep: [] });
              else if (it.sep)
                it.value = token;
              else
                Object.assign(it, { key: token, sep: [] });
              return;
            }
            /* istanbul ignore next should not happen */
            default:
              yield* this.pop();
              yield* this.pop(token);
          }
          if ((top.type === "document" || top.type === "block-map" || top.type === "block-seq") && (token.type === "block-map" || token.type === "block-seq")) {
            const last = token.items[token.items.length - 1];
            if (last && !last.sep && !last.value && last.start.length > 0 && findNonEmptyIndex(last.start) === -1 && (token.indent === 0 || last.start.every((st) => st.type !== "comment" || st.indent < token.indent))) {
              if (top.type === "document")
                top.end = last.start;
              else
                top.items.push({ start: last.start });
              token.items.splice(-1, 1);
            }
          }
        }
      }
      *stream() {
        switch (this.type) {
          case "directive-line":
            yield { type: "directive", offset: this.offset, source: this.source };
            return;
          case "byte-order-mark":
          case "space":
          case "comment":
          case "newline":
            yield this.sourceToken;
            return;
          case "doc-mode":
          case "doc-start": {
            const doc = {
              type: "document",
              offset: this.offset,
              start: []
            };
            if (this.type === "doc-start")
              doc.start.push(this.sourceToken);
            this.stack.push(doc);
            return;
          }
        }
        yield {
          type: "error",
          offset: this.offset,
          message: `Unexpected ${this.type} token in YAML stream`,
          source: this.source
        };
      }
      *document(doc) {
        if (doc.value)
          return yield* this.lineEnd(doc);
        switch (this.type) {
          case "doc-start": {
            if (findNonEmptyIndex(doc.start) !== -1) {
              yield* this.pop();
              yield* this.step();
            } else
              doc.start.push(this.sourceToken);
            return;
          }
          case "anchor":
          case "tag":
          case "space":
          case "comment":
          case "newline":
            doc.start.push(this.sourceToken);
            return;
        }
        const bv = this.startBlockValue(doc);
        if (bv)
          this.stack.push(bv);
        else {
          yield {
            type: "error",
            offset: this.offset,
            message: `Unexpected ${this.type} token in YAML document`,
            source: this.source
          };
        }
      }
      *scalar(scalar) {
        if (this.type === "map-value-ind") {
          const prev = getPrevProps(this.peek(2));
          const start = getFirstKeyStartProps(prev);
          let sep2;
          if (scalar.end) {
            sep2 = scalar.end;
            sep2.push(this.sourceToken);
            delete scalar.end;
          } else
            sep2 = [this.sourceToken];
          const map = {
            type: "block-map",
            offset: scalar.offset,
            indent: scalar.indent,
            items: [{ start, key: scalar, sep: sep2 }]
          };
          this.onKeyLine = true;
          this.stack[this.stack.length - 1] = map;
        } else
          yield* this.lineEnd(scalar);
      }
      *blockScalar(scalar) {
        switch (this.type) {
          case "space":
          case "comment":
          case "newline":
            scalar.props.push(this.sourceToken);
            return;
          case "scalar":
            scalar.source = this.source;
            this.atNewLine = true;
            this.indent = 0;
            if (this.onNewLine) {
              let nl = this.source.indexOf("\n") + 1;
              while (nl !== 0) {
                this.onNewLine(this.offset + nl);
                nl = this.source.indexOf("\n", nl) + 1;
              }
            }
            yield* this.pop();
            break;
          /* istanbul ignore next should not happen */
          default:
            yield* this.pop();
            yield* this.step();
        }
      }
      *blockMap(map) {
        const it = map.items[map.items.length - 1];
        switch (this.type) {
          case "newline":
            this.onKeyLine = false;
            if (it.value) {
              const end = "end" in it.value ? it.value.end : void 0;
              const last = Array.isArray(end) ? end[end.length - 1] : void 0;
              if (last?.type === "comment")
                end?.push(this.sourceToken);
              else
                map.items.push({ start: [this.sourceToken] });
            } else if (it.sep) {
              it.sep.push(this.sourceToken);
            } else {
              it.start.push(this.sourceToken);
            }
            return;
          case "space":
          case "comment":
            if (it.value) {
              map.items.push({ start: [this.sourceToken] });
            } else if (it.sep) {
              it.sep.push(this.sourceToken);
            } else {
              if (this.atIndentedComment(it.start, map.indent)) {
                const prev = map.items[map.items.length - 2];
                const end = prev?.value?.end;
                if (Array.isArray(end)) {
                  arrayPushArray(end, it.start);
                  end.push(this.sourceToken);
                  map.items.pop();
                  return;
                }
              }
              it.start.push(this.sourceToken);
            }
            return;
        }
        if (this.indent >= map.indent) {
          const atMapIndent = !this.onKeyLine && this.indent === map.indent;
          const atNextItem = atMapIndent && (it.sep || it.explicitKey) && this.type !== "seq-item-ind";
          let start = [];
          if (atNextItem && it.sep && !it.value) {
            const nl = [];
            for (let i = 0; i < it.sep.length; ++i) {
              const st = it.sep[i];
              switch (st.type) {
                case "newline":
                  nl.push(i);
                  break;
                case "space":
                  break;
                case "comment":
                  if (st.indent > map.indent)
                    nl.length = 0;
                  break;
                default:
                  nl.length = 0;
              }
            }
            if (nl.length >= 2)
              start = it.sep.splice(nl[1]);
          }
          switch (this.type) {
            case "anchor":
            case "tag":
              if (atNextItem || it.value) {
                start.push(this.sourceToken);
                map.items.push({ start });
                this.onKeyLine = true;
              } else if (it.sep) {
                it.sep.push(this.sourceToken);
              } else {
                it.start.push(this.sourceToken);
              }
              return;
            case "explicit-key-ind":
              if (!it.sep && !it.explicitKey) {
                it.start.push(this.sourceToken);
                it.explicitKey = true;
              } else if (atNextItem || it.value) {
                start.push(this.sourceToken);
                map.items.push({ start, explicitKey: true });
              } else {
                this.stack.push({
                  type: "block-map",
                  offset: this.offset,
                  indent: this.indent,
                  items: [{ start: [this.sourceToken], explicitKey: true }]
                });
              }
              this.onKeyLine = true;
              return;
            case "map-value-ind":
              if (it.explicitKey) {
                if (!it.sep) {
                  if (includesToken(it.start, "newline")) {
                    Object.assign(it, { key: null, sep: [this.sourceToken] });
                  } else {
                    const start2 = getFirstKeyStartProps(it.start);
                    this.stack.push({
                      type: "block-map",
                      offset: this.offset,
                      indent: this.indent,
                      items: [{ start: start2, key: null, sep: [this.sourceToken] }]
                    });
                  }
                } else if (it.value) {
                  map.items.push({ start: [], key: null, sep: [this.sourceToken] });
                } else if (includesToken(it.sep, "map-value-ind")) {
                  this.stack.push({
                    type: "block-map",
                    offset: this.offset,
                    indent: this.indent,
                    items: [{ start, key: null, sep: [this.sourceToken] }]
                  });
                } else if (isFlowToken(it.key) && !includesToken(it.sep, "newline")) {
                  const start2 = getFirstKeyStartProps(it.start);
                  const key = it.key;
                  const sep2 = it.sep;
                  sep2.push(this.sourceToken);
                  delete it.key;
                  delete it.sep;
                  this.stack.push({
                    type: "block-map",
                    offset: this.offset,
                    indent: this.indent,
                    items: [{ start: start2, key, sep: sep2 }]
                  });
                } else if (start.length > 0) {
                  it.sep = it.sep.concat(start, this.sourceToken);
                } else {
                  it.sep.push(this.sourceToken);
                }
              } else {
                if (!it.sep) {
                  Object.assign(it, { key: null, sep: [this.sourceToken] });
                } else if (it.value || atNextItem) {
                  map.items.push({ start, key: null, sep: [this.sourceToken] });
                } else if (includesToken(it.sep, "map-value-ind")) {
                  this.stack.push({
                    type: "block-map",
                    offset: this.offset,
                    indent: this.indent,
                    items: [{ start: [], key: null, sep: [this.sourceToken] }]
                  });
                } else {
                  it.sep.push(this.sourceToken);
                }
              }
              this.onKeyLine = true;
              return;
            case "alias":
            case "scalar":
            case "single-quoted-scalar":
            case "double-quoted-scalar": {
              const fs = this.flowScalar(this.type);
              if (atNextItem || it.value) {
                map.items.push({ start, key: fs, sep: [] });
                this.onKeyLine = true;
              } else if (it.sep) {
                this.stack.push(fs);
              } else {
                Object.assign(it, { key: fs, sep: [] });
                this.onKeyLine = true;
              }
              return;
            }
            default: {
              const bv = this.startBlockValue(map);
              if (bv) {
                if (bv.type === "block-seq") {
                  if (!it.explicitKey && it.sep && !includesToken(it.sep, "newline")) {
                    yield* this.pop({
                      type: "error",
                      offset: this.offset,
                      message: "Unexpected block-seq-ind on same line with key",
                      source: this.source
                    });
                    return;
                  }
                } else if (atMapIndent) {
                  map.items.push({ start });
                }
                this.stack.push(bv);
                return;
              }
            }
          }
        }
        yield* this.pop();
        yield* this.step();
      }
      *blockSequence(seq) {
        const it = seq.items[seq.items.length - 1];
        switch (this.type) {
          case "newline":
            if (it.value) {
              const end = "end" in it.value ? it.value.end : void 0;
              const last = Array.isArray(end) ? end[end.length - 1] : void 0;
              if (last?.type === "comment")
                end?.push(this.sourceToken);
              else
                seq.items.push({ start: [this.sourceToken] });
            } else
              it.start.push(this.sourceToken);
            return;
          case "space":
          case "comment":
            if (it.value)
              seq.items.push({ start: [this.sourceToken] });
            else {
              if (this.atIndentedComment(it.start, seq.indent)) {
                const prev = seq.items[seq.items.length - 2];
                const end = prev?.value?.end;
                if (Array.isArray(end)) {
                  arrayPushArray(end, it.start);
                  end.push(this.sourceToken);
                  seq.items.pop();
                  return;
                }
              }
              it.start.push(this.sourceToken);
            }
            return;
          case "anchor":
          case "tag":
            if (it.value || this.indent <= seq.indent)
              break;
            it.start.push(this.sourceToken);
            return;
          case "seq-item-ind":
            if (this.indent !== seq.indent)
              break;
            if (it.value || includesToken(it.start, "seq-item-ind"))
              seq.items.push({ start: [this.sourceToken] });
            else
              it.start.push(this.sourceToken);
            return;
        }
        if (this.indent > seq.indent) {
          const bv = this.startBlockValue(seq);
          if (bv) {
            this.stack.push(bv);
            return;
          }
        }
        yield* this.pop();
        yield* this.step();
      }
      *flowCollection(fc) {
        const it = fc.items[fc.items.length - 1];
        if (this.type === "flow-error-end") {
          let top;
          do {
            yield* this.pop();
            top = this.peek(1);
          } while (top?.type === "flow-collection");
        } else if (fc.end.length === 0) {
          switch (this.type) {
            case "comma":
            case "explicit-key-ind":
              if (!it || it.sep)
                fc.items.push({ start: [this.sourceToken] });
              else
                it.start.push(this.sourceToken);
              return;
            case "map-value-ind":
              if (!it || it.value)
                fc.items.push({ start: [], key: null, sep: [this.sourceToken] });
              else if (it.sep)
                it.sep.push(this.sourceToken);
              else
                Object.assign(it, { key: null, sep: [this.sourceToken] });
              return;
            case "space":
            case "comment":
            case "newline":
            case "anchor":
            case "tag":
              if (!it || it.value)
                fc.items.push({ start: [this.sourceToken] });
              else if (it.sep)
                it.sep.push(this.sourceToken);
              else
                it.start.push(this.sourceToken);
              return;
            case "alias":
            case "scalar":
            case "single-quoted-scalar":
            case "double-quoted-scalar": {
              const fs = this.flowScalar(this.type);
              if (!it || it.value)
                fc.items.push({ start: [], key: fs, sep: [] });
              else if (it.sep)
                this.stack.push(fs);
              else
                Object.assign(it, { key: fs, sep: [] });
              return;
            }
            case "flow-map-end":
            case "flow-seq-end":
              fc.end.push(this.sourceToken);
              return;
          }
          const bv = this.startBlockValue(fc);
          if (bv)
            this.stack.push(bv);
          else {
            yield* this.pop();
            yield* this.step();
          }
        } else {
          const parent = this.peek(2);
          if (parent.type === "block-map" && (this.type === "map-value-ind" && parent.indent === fc.indent || this.type === "newline" && !parent.items[parent.items.length - 1].sep)) {
            yield* this.pop();
            yield* this.step();
          } else if (this.type === "map-value-ind" && parent.type !== "flow-collection") {
            const prev = getPrevProps(parent);
            const start = getFirstKeyStartProps(prev);
            fixFlowSeqItems(fc);
            const sep2 = fc.end.splice(1, fc.end.length);
            sep2.push(this.sourceToken);
            const map = {
              type: "block-map",
              offset: fc.offset,
              indent: fc.indent,
              items: [{ start, key: fc, sep: sep2 }]
            };
            this.onKeyLine = true;
            this.stack[this.stack.length - 1] = map;
          } else {
            yield* this.lineEnd(fc);
          }
        }
      }
      flowScalar(type) {
        if (this.onNewLine) {
          let nl = this.source.indexOf("\n") + 1;
          while (nl !== 0) {
            this.onNewLine(this.offset + nl);
            nl = this.source.indexOf("\n", nl) + 1;
          }
        }
        return {
          type,
          offset: this.offset,
          indent: this.indent,
          source: this.source
        };
      }
      startBlockValue(parent) {
        switch (this.type) {
          case "alias":
          case "scalar":
          case "single-quoted-scalar":
          case "double-quoted-scalar":
            return this.flowScalar(this.type);
          case "block-scalar-header":
            return {
              type: "block-scalar",
              offset: this.offset,
              indent: this.indent,
              props: [this.sourceToken],
              source: ""
            };
          case "flow-map-start":
          case "flow-seq-start":
            return {
              type: "flow-collection",
              offset: this.offset,
              indent: this.indent,
              start: this.sourceToken,
              items: [],
              end: []
            };
          case "seq-item-ind":
            return {
              type: "block-seq",
              offset: this.offset,
              indent: this.indent,
              items: [{ start: [this.sourceToken] }]
            };
          case "explicit-key-ind": {
            this.onKeyLine = true;
            const prev = getPrevProps(parent);
            const start = getFirstKeyStartProps(prev);
            start.push(this.sourceToken);
            return {
              type: "block-map",
              offset: this.offset,
              indent: this.indent,
              items: [{ start, explicitKey: true }]
            };
          }
          case "map-value-ind": {
            this.onKeyLine = true;
            const prev = getPrevProps(parent);
            const start = getFirstKeyStartProps(prev);
            return {
              type: "block-map",
              offset: this.offset,
              indent: this.indent,
              items: [{ start, key: null, sep: [this.sourceToken] }]
            };
          }
        }
        return null;
      }
      atIndentedComment(start, indent) {
        if (this.type !== "comment")
          return false;
        if (this.indent <= indent)
          return false;
        return start.every((st) => st.type === "newline" || st.type === "space");
      }
      *documentEnd(docEnd) {
        if (this.type !== "doc-mode") {
          if (docEnd.end)
            docEnd.end.push(this.sourceToken);
          else
            docEnd.end = [this.sourceToken];
          if (this.type === "newline")
            yield* this.pop();
        }
      }
      *lineEnd(token) {
        switch (this.type) {
          case "comma":
          case "doc-start":
          case "doc-end":
          case "flow-seq-end":
          case "flow-map-end":
          case "map-value-ind":
            yield* this.pop();
            yield* this.step();
            break;
          case "newline":
            this.onKeyLine = false;
          // fallthrough
          case "space":
          case "comment":
          default:
            if (token.end)
              token.end.push(this.sourceToken);
            else
              token.end = [this.sourceToken];
            if (this.type === "newline")
              yield* this.pop();
        }
      }
    };
    exports.Parser = Parser;
  }
});

// ../../node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/public-api.js
var require_public_api = __commonJS({
  "../../node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/public-api.js"(exports) {
    "use strict";
    var composer = require_composer();
    var Document = require_Document();
    var errors = require_errors();
    var log = require_log();
    var identity = require_identity();
    var lineCounter = require_line_counter();
    var parser = require_parser();
    function parseOptions(options) {
      const prettyErrors = options.prettyErrors !== false;
      const lineCounter$1 = options.lineCounter || prettyErrors && new lineCounter.LineCounter() || null;
      return { lineCounter: lineCounter$1, prettyErrors };
    }
    function parseAllDocuments(source, options = {}) {
      const { lineCounter: lineCounter2, prettyErrors } = parseOptions(options);
      const parser$1 = new parser.Parser(lineCounter2?.addNewLine);
      const composer$1 = new composer.Composer(options);
      const docs = Array.from(composer$1.compose(parser$1.parse(source)));
      if (prettyErrors && lineCounter2)
        for (const doc of docs) {
          doc.errors.forEach(errors.prettifyError(source, lineCounter2));
          doc.warnings.forEach(errors.prettifyError(source, lineCounter2));
        }
      if (docs.length > 0)
        return docs;
      return Object.assign([], { empty: true }, composer$1.streamInfo());
    }
    function parseDocument2(source, options = {}) {
      const { lineCounter: lineCounter2, prettyErrors } = parseOptions(options);
      const parser$1 = new parser.Parser(lineCounter2?.addNewLine);
      const composer$1 = new composer.Composer(options);
      let doc = null;
      for (const _doc of composer$1.compose(parser$1.parse(source), true, source.length)) {
        if (!doc)
          doc = _doc;
        else if (doc.options.logLevel !== "silent") {
          doc.errors.push(new errors.YAMLParseError(_doc.range.slice(0, 2), "MULTIPLE_DOCS", "Source contains multiple documents; please use YAML.parseAllDocuments()"));
          break;
        }
      }
      if (prettyErrors && lineCounter2) {
        doc.errors.forEach(errors.prettifyError(source, lineCounter2));
        doc.warnings.forEach(errors.prettifyError(source, lineCounter2));
      }
      return doc;
    }
    function parse(src, reviver, options) {
      let _reviver = void 0;
      if (typeof reviver === "function") {
        _reviver = reviver;
      } else if (options === void 0 && reviver && typeof reviver === "object") {
        options = reviver;
      }
      const doc = parseDocument2(src, options);
      if (!doc)
        return null;
      doc.warnings.forEach((warning) => log.warn(doc.options.logLevel, warning));
      if (doc.errors.length > 0) {
        if (doc.options.logLevel !== "silent")
          throw doc.errors[0];
        else
          doc.errors = [];
      }
      return doc.toJS(Object.assign({ reviver: _reviver }, options));
    }
    function stringify(value, replacer, options) {
      let _replacer = null;
      if (typeof replacer === "function" || Array.isArray(replacer)) {
        _replacer = replacer;
      } else if (options === void 0 && replacer) {
        options = replacer;
      }
      if (typeof options === "string")
        options = options.length;
      if (typeof options === "number") {
        const indent = Math.round(options);
        options = indent < 1 ? void 0 : indent > 8 ? { indent: 8 } : { indent };
      }
      if (value === void 0) {
        const { keepUndefined } = options ?? replacer ?? {};
        if (!keepUndefined)
          return void 0;
      }
      if (identity.isDocument(value) && !_replacer)
        return value.toString(options);
      return new Document.Document(value, _replacer, options).toString(options);
    }
    exports.parse = parse;
    exports.parseAllDocuments = parseAllDocuments;
    exports.parseDocument = parseDocument2;
    exports.stringify = stringify;
  }
});

// ../../node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/index.js
var require_dist = __commonJS({
  "../../node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/index.js"(exports) {
    "use strict";
    var composer = require_composer();
    var Document = require_Document();
    var Schema = require_Schema();
    var errors = require_errors();
    var Alias = require_Alias();
    var identity = require_identity();
    var Pair = require_Pair();
    var Scalar = require_Scalar();
    var YAMLMap = require_YAMLMap();
    var YAMLSeq2 = require_YAMLSeq();
    var cst = require_cst();
    var lexer = require_lexer();
    var lineCounter = require_line_counter();
    var parser = require_parser();
    var publicApi = require_public_api();
    var visit = require_visit();
    exports.Composer = composer.Composer;
    exports.Document = Document.Document;
    exports.Schema = Schema.Schema;
    exports.YAMLError = errors.YAMLError;
    exports.YAMLParseError = errors.YAMLParseError;
    exports.YAMLWarning = errors.YAMLWarning;
    exports.Alias = Alias.Alias;
    exports.isAlias = identity.isAlias;
    exports.isCollection = identity.isCollection;
    exports.isDocument = identity.isDocument;
    exports.isMap = identity.isMap;
    exports.isNode = identity.isNode;
    exports.isPair = identity.isPair;
    exports.isScalar = identity.isScalar;
    exports.isSeq = identity.isSeq;
    exports.Pair = Pair.Pair;
    exports.Scalar = Scalar.Scalar;
    exports.YAMLMap = YAMLMap.YAMLMap;
    exports.YAMLSeq = YAMLSeq2.YAMLSeq;
    exports.CST = cst;
    exports.Lexer = lexer.Lexer;
    exports.LineCounter = lineCounter.LineCounter;
    exports.Parser = parser.Parser;
    exports.parse = publicApi.parse;
    exports.parseAllDocuments = publicApi.parseAllDocuments;
    exports.parseDocument = publicApi.parseDocument;
    exports.stringify = publicApi.stringify;
    exports.visit = visit.visit;
    exports.visitAsync = visit.visitAsync;
  }
});

// ../../node_modules/.pnpm/picomatch@4.0.5/node_modules/picomatch/lib/constants.js
var require_constants = __commonJS({
  "../../node_modules/.pnpm/picomatch@4.0.5/node_modules/picomatch/lib/constants.js"(exports, module) {
    "use strict";
    var WIN_SLASH = "\\\\/";
    var WIN_NO_SLASH = `[^${WIN_SLASH}]`;
    var DEFAULT_MAX_EXTGLOB_RECURSION = 0;
    var DOT_LITERAL = "\\.";
    var PLUS_LITERAL = "\\+";
    var QMARK_LITERAL = "\\?";
    var SLASH_LITERAL = "\\/";
    var ONE_CHAR = "(?=.)";
    var QMARK = "[^/]";
    var END_ANCHOR = `(?:${SLASH_LITERAL}|$)`;
    var START_ANCHOR = `(?:^|${SLASH_LITERAL})`;
    var DOTS_SLASH = `${DOT_LITERAL}{1,2}${END_ANCHOR}`;
    var NO_DOT = `(?!${DOT_LITERAL})`;
    var NO_DOTS = `(?!${START_ANCHOR}${DOTS_SLASH})`;
    var NO_DOT_SLASH = `(?!${DOT_LITERAL}{0,1}${END_ANCHOR})`;
    var NO_DOTS_SLASH = `(?!${DOTS_SLASH})`;
    var QMARK_NO_DOT = `[^.${SLASH_LITERAL}]`;
    var STAR = `${QMARK}*?`;
    var SEP = "/";
    var POSIX_CHARS = {
      DOT_LITERAL,
      PLUS_LITERAL,
      QMARK_LITERAL,
      SLASH_LITERAL,
      ONE_CHAR,
      QMARK,
      END_ANCHOR,
      DOTS_SLASH,
      NO_DOT,
      NO_DOTS,
      NO_DOT_SLASH,
      NO_DOTS_SLASH,
      QMARK_NO_DOT,
      STAR,
      START_ANCHOR,
      SEP
    };
    var WINDOWS_CHARS = {
      ...POSIX_CHARS,
      SLASH_LITERAL: `[${WIN_SLASH}]`,
      QMARK: WIN_NO_SLASH,
      STAR: `${WIN_NO_SLASH}*?`,
      DOTS_SLASH: `${DOT_LITERAL}{1,2}(?:[${WIN_SLASH}]|$)`,
      NO_DOT: `(?!${DOT_LITERAL})`,
      NO_DOTS: `(?!(?:^|[${WIN_SLASH}])${DOT_LITERAL}{1,2}(?:[${WIN_SLASH}]|$))`,
      NO_DOT_SLASH: `(?!${DOT_LITERAL}{0,1}(?:[${WIN_SLASH}]|$))`,
      NO_DOTS_SLASH: `(?!${DOT_LITERAL}{1,2}(?:[${WIN_SLASH}]|$))`,
      QMARK_NO_DOT: `[^.${WIN_SLASH}]`,
      START_ANCHOR: `(?:^|[${WIN_SLASH}])`,
      END_ANCHOR: `(?:[${WIN_SLASH}]|$)`,
      SEP: "\\"
    };
    var POSIX_REGEX_SOURCE = {
      __proto__: null,
      alnum: "a-zA-Z0-9",
      alpha: "a-zA-Z",
      ascii: "\\x00-\\x7F",
      blank: " \\t",
      cntrl: "\\x00-\\x1F\\x7F",
      digit: "0-9",
      graph: "\\x21-\\x7E",
      lower: "a-z",
      print: "\\x20-\\x7E ",
      punct: "\\-!\"#$%&'()\\*+,./:;<=>?@[\\]^_`{|}~",
      space: " \\t\\r\\n\\v\\f",
      upper: "A-Z",
      word: "A-Za-z0-9_",
      xdigit: "A-Fa-f0-9"
    };
    module.exports = {
      DEFAULT_MAX_EXTGLOB_RECURSION,
      MAX_LENGTH: 1024 * 64,
      POSIX_REGEX_SOURCE,
      // regular expressions
      REGEX_BACKSLASH: /\\(?![*+?^${}(|)[\]])/g,
      REGEX_NON_SPECIAL_CHARS: /^[^@![\].,$*+?^{}()|\\/]+/,
      REGEX_SPECIAL_CHARS: /[-*+?.^${}(|)[\]]/,
      REGEX_SPECIAL_CHARS_BACKREF: /(\\?)((\W)(\3*))/g,
      REGEX_SPECIAL_CHARS_GLOBAL: /([-*+?.^${}(|)[\]])/g,
      REGEX_REMOVE_BACKSLASH: /(?:\[.*?[^\\]\]|\\(?=.))/g,
      // Replace globs with equivalent patterns to reduce parsing time.
      REPLACEMENTS: {
        __proto__: null,
        "***": "*",
        "**/**": "**",
        "**/**/**": "**"
      },
      // Digits
      CHAR_0: 48,
      /* 0 */
      CHAR_9: 57,
      /* 9 */
      // Alphabet chars.
      CHAR_UPPERCASE_A: 65,
      /* A */
      CHAR_LOWERCASE_A: 97,
      /* a */
      CHAR_UPPERCASE_Z: 90,
      /* Z */
      CHAR_LOWERCASE_Z: 122,
      /* z */
      CHAR_LEFT_PARENTHESES: 40,
      /* ( */
      CHAR_RIGHT_PARENTHESES: 41,
      /* ) */
      CHAR_ASTERISK: 42,
      /* * */
      // Non-alphabetic chars.
      CHAR_AMPERSAND: 38,
      /* & */
      CHAR_AT: 64,
      /* @ */
      CHAR_BACKWARD_SLASH: 92,
      /* \ */
      CHAR_CARRIAGE_RETURN: 13,
      /* \r */
      CHAR_CIRCUMFLEX_ACCENT: 94,
      /* ^ */
      CHAR_COLON: 58,
      /* : */
      CHAR_COMMA: 44,
      /* , */
      CHAR_DOT: 46,
      /* . */
      CHAR_DOUBLE_QUOTE: 34,
      /* " */
      CHAR_EQUAL: 61,
      /* = */
      CHAR_EXCLAMATION_MARK: 33,
      /* ! */
      CHAR_FORM_FEED: 12,
      /* \f */
      CHAR_FORWARD_SLASH: 47,
      /* / */
      CHAR_GRAVE_ACCENT: 96,
      /* ` */
      CHAR_HASH: 35,
      /* # */
      CHAR_HYPHEN_MINUS: 45,
      /* - */
      CHAR_LEFT_ANGLE_BRACKET: 60,
      /* < */
      CHAR_LEFT_CURLY_BRACE: 123,
      /* { */
      CHAR_LEFT_SQUARE_BRACKET: 91,
      /* [ */
      CHAR_LINE_FEED: 10,
      /* \n */
      CHAR_NO_BREAK_SPACE: 160,
      /* \u00A0 */
      CHAR_PERCENT: 37,
      /* % */
      CHAR_PLUS: 43,
      /* + */
      CHAR_QUESTION_MARK: 63,
      /* ? */
      CHAR_RIGHT_ANGLE_BRACKET: 62,
      /* > */
      CHAR_RIGHT_CURLY_BRACE: 125,
      /* } */
      CHAR_RIGHT_SQUARE_BRACKET: 93,
      /* ] */
      CHAR_SEMICOLON: 59,
      /* ; */
      CHAR_SINGLE_QUOTE: 39,
      /* ' */
      CHAR_SPACE: 32,
      /*   */
      CHAR_TAB: 9,
      /* \t */
      CHAR_UNDERSCORE: 95,
      /* _ */
      CHAR_VERTICAL_LINE: 124,
      /* | */
      CHAR_ZERO_WIDTH_NOBREAK_SPACE: 65279,
      /* \uFEFF */
      /**
       * Create EXTGLOB_CHARS
       */
      extglobChars(chars) {
        return {
          "!": { type: "negate", open: "(?:(?!(?:", close: `))${chars.STAR})` },
          "?": { type: "qmark", open: "(?:", close: ")?" },
          "+": { type: "plus", open: "(?:", close: ")+" },
          "*": { type: "star", open: "(?:", close: ")*" },
          "@": { type: "at", open: "(?:", close: ")" }
        };
      },
      /**
       * Create GLOB_CHARS
       */
      globChars(win32) {
        return win32 === true ? WINDOWS_CHARS : POSIX_CHARS;
      }
    };
  }
});

// ../../node_modules/.pnpm/picomatch@4.0.5/node_modules/picomatch/lib/utils.js
var require_utils = __commonJS({
  "../../node_modules/.pnpm/picomatch@4.0.5/node_modules/picomatch/lib/utils.js"(exports) {
    "use strict";
    var {
      REGEX_BACKSLASH,
      REGEX_REMOVE_BACKSLASH,
      REGEX_SPECIAL_CHARS,
      REGEX_SPECIAL_CHARS_GLOBAL
    } = require_constants();
    exports.isObject = (val) => val !== null && typeof val === "object" && !Array.isArray(val);
    exports.hasRegexChars = (str3) => REGEX_SPECIAL_CHARS.test(str3);
    exports.isRegexChar = (str3) => str3.length === 1 && exports.hasRegexChars(str3);
    exports.escapeRegex = (str3) => str3.replace(REGEX_SPECIAL_CHARS_GLOBAL, "\\$1");
    exports.toPosixSlashes = (str3) => str3.replace(REGEX_BACKSLASH, "/");
    exports.isWindows = () => {
      if (typeof navigator !== "undefined" && navigator.platform) {
        const platform = navigator.platform.toLowerCase();
        return platform === "win32" || platform === "windows";
      }
      if (typeof process !== "undefined" && process.platform) {
        return process.platform === "win32";
      }
      return false;
    };
    exports.removeBackslashes = (str3) => {
      return str3.replace(REGEX_REMOVE_BACKSLASH, (match) => {
        return match === "\\" ? "" : match;
      });
    };
    exports.escapeLast = (input, char, lastIdx) => {
      const idx = input.lastIndexOf(char, lastIdx);
      if (idx === -1) return input;
      if (input[idx - 1] === "\\") return exports.escapeLast(input, char, idx - 1);
      return `${input.slice(0, idx)}\\${input.slice(idx)}`;
    };
    exports.removePrefix = (input, state = {}) => {
      let output = input;
      if (output.startsWith("./")) {
        output = output.slice(2);
        state.prefix = "./";
      }
      return output;
    };
    exports.wrapOutput = (input, state = {}, options = {}) => {
      const prepend = options.contains ? "" : "^";
      const append = options.contains ? "" : "$";
      let output = `${prepend}(?:${input})${append}`;
      if (state.negated === true) {
        output = `(?:^(?!${output}).*$)`;
      }
      return output;
    };
    exports.basename = (path, { windows } = {}) => {
      const segs = path.split(windows ? /[\\/]/ : "/");
      const last = segs[segs.length - 1];
      if (last === "") {
        return segs[segs.length - 2];
      }
      return last;
    };
  }
});

// ../../node_modules/.pnpm/picomatch@4.0.5/node_modules/picomatch/lib/scan.js
var require_scan = __commonJS({
  "../../node_modules/.pnpm/picomatch@4.0.5/node_modules/picomatch/lib/scan.js"(exports, module) {
    "use strict";
    var utils = require_utils();
    var {
      CHAR_ASTERISK,
      /* * */
      CHAR_AT,
      /* @ */
      CHAR_BACKWARD_SLASH,
      /* \ */
      CHAR_COMMA,
      /* , */
      CHAR_DOT,
      /* . */
      CHAR_EXCLAMATION_MARK,
      /* ! */
      CHAR_FORWARD_SLASH,
      /* / */
      CHAR_LEFT_CURLY_BRACE,
      /* { */
      CHAR_LEFT_PARENTHESES,
      /* ( */
      CHAR_LEFT_SQUARE_BRACKET,
      /* [ */
      CHAR_PLUS,
      /* + */
      CHAR_QUESTION_MARK,
      /* ? */
      CHAR_RIGHT_CURLY_BRACE,
      /* } */
      CHAR_RIGHT_PARENTHESES,
      /* ) */
      CHAR_RIGHT_SQUARE_BRACKET
      /* ] */
    } = require_constants();
    var isPathSeparator = (code) => {
      return code === CHAR_FORWARD_SLASH || code === CHAR_BACKWARD_SLASH;
    };
    var depth = (token) => {
      if (token.isPrefix !== true) {
        token.depth = token.isGlobstar ? Infinity : 1;
      }
    };
    var scan = (input, options) => {
      const opts = options || {};
      const length = input.length - 1;
      const scanToEnd = opts.parts === true || opts.scanToEnd === true;
      const slashes = [];
      const tokens = [];
      const parts = [];
      let str3 = input;
      let index = -1;
      let start = 0;
      let lastIndex = 0;
      let isBrace = false;
      let isBracket = false;
      let isGlob = false;
      let isExtglob = false;
      let isGlobstar = false;
      let braceEscaped = false;
      let backslashes = false;
      let negated = false;
      let negatedExtglob = false;
      let finished = false;
      let braces = 0;
      let prev;
      let code;
      let token = { value: "", depth: 0, isGlob: false };
      const eos = () => index >= length;
      const peek = () => str3.charCodeAt(index + 1);
      const advance = () => {
        prev = code;
        return str3.charCodeAt(++index);
      };
      while (index < length) {
        code = advance();
        let next;
        if (code === CHAR_BACKWARD_SLASH) {
          backslashes = token.backslashes = true;
          code = advance();
          if (code === CHAR_LEFT_CURLY_BRACE) {
            braceEscaped = true;
          }
          continue;
        }
        if (braceEscaped === true || code === CHAR_LEFT_CURLY_BRACE) {
          braces++;
          while (eos() !== true && (code = advance())) {
            if (code === CHAR_BACKWARD_SLASH) {
              backslashes = token.backslashes = true;
              advance();
              continue;
            }
            if (code === CHAR_LEFT_CURLY_BRACE) {
              braces++;
              continue;
            }
            if (braceEscaped !== true && code === CHAR_DOT && (code = advance()) === CHAR_DOT) {
              isBrace = token.isBrace = true;
              isGlob = token.isGlob = true;
              finished = true;
              if (scanToEnd === true) {
                continue;
              }
              break;
            }
            if (braceEscaped !== true && code === CHAR_COMMA) {
              isBrace = token.isBrace = true;
              isGlob = token.isGlob = true;
              finished = true;
              if (scanToEnd === true) {
                continue;
              }
              break;
            }
            if (code === CHAR_RIGHT_CURLY_BRACE) {
              braces--;
              if (braces === 0) {
                braceEscaped = false;
                isBrace = token.isBrace = true;
                finished = true;
                break;
              }
            }
          }
          if (scanToEnd === true) {
            continue;
          }
          break;
        }
        if (code === CHAR_FORWARD_SLASH) {
          slashes.push(index);
          tokens.push(token);
          token = { value: "", depth: 0, isGlob: false };
          if (finished === true) continue;
          if (prev === CHAR_DOT && index === start + 1) {
            start += 2;
            continue;
          }
          lastIndex = index + 1;
          continue;
        }
        if (opts.noext !== true) {
          const isExtglobChar = code === CHAR_PLUS || code === CHAR_AT || code === CHAR_ASTERISK || code === CHAR_QUESTION_MARK || code === CHAR_EXCLAMATION_MARK;
          if (isExtglobChar === true && peek() === CHAR_LEFT_PARENTHESES) {
            isGlob = token.isGlob = true;
            isExtglob = token.isExtglob = true;
            finished = true;
            if (code === CHAR_EXCLAMATION_MARK && index === start) {
              negatedExtglob = true;
            }
            if (scanToEnd === true) {
              while (eos() !== true && (code = advance())) {
                if (code === CHAR_BACKWARD_SLASH) {
                  backslashes = token.backslashes = true;
                  code = advance();
                  continue;
                }
                if (code === CHAR_RIGHT_PARENTHESES) {
                  isGlob = token.isGlob = true;
                  finished = true;
                  break;
                }
              }
              continue;
            }
            break;
          }
        }
        if (code === CHAR_ASTERISK) {
          if (prev === CHAR_ASTERISK) isGlobstar = token.isGlobstar = true;
          isGlob = token.isGlob = true;
          finished = true;
          if (scanToEnd === true) {
            continue;
          }
          break;
        }
        if (code === CHAR_QUESTION_MARK) {
          isGlob = token.isGlob = true;
          finished = true;
          if (scanToEnd === true) {
            continue;
          }
          break;
        }
        if (code === CHAR_LEFT_SQUARE_BRACKET) {
          while (eos() !== true && (next = advance())) {
            if (next === CHAR_BACKWARD_SLASH) {
              backslashes = token.backslashes = true;
              advance();
              continue;
            }
            if (next === CHAR_RIGHT_SQUARE_BRACKET) {
              isBracket = token.isBracket = true;
              isGlob = token.isGlob = true;
              finished = true;
              break;
            }
          }
          if (scanToEnd === true) {
            continue;
          }
          break;
        }
        if (opts.nonegate !== true && code === CHAR_EXCLAMATION_MARK && index === start) {
          negated = token.negated = true;
          start++;
          continue;
        }
        if (opts.noparen !== true && code === CHAR_LEFT_PARENTHESES) {
          isGlob = token.isGlob = true;
          if (scanToEnd === true) {
            while (eos() !== true && (code = advance())) {
              if (code === CHAR_LEFT_PARENTHESES) {
                backslashes = token.backslashes = true;
                code = advance();
                continue;
              }
              if (code === CHAR_RIGHT_PARENTHESES) {
                finished = true;
                break;
              }
            }
            continue;
          }
          break;
        }
        if (isGlob === true) {
          finished = true;
          if (scanToEnd === true) {
            continue;
          }
          break;
        }
      }
      if (opts.noext === true) {
        isExtglob = false;
        isGlob = false;
      }
      let base = str3;
      let prefix = "";
      let glob = "";
      if (start > 0) {
        prefix = str3.slice(0, start);
        str3 = str3.slice(start);
        lastIndex -= start;
      }
      if (base && isGlob === true && lastIndex > 0) {
        base = str3.slice(0, lastIndex);
        glob = str3.slice(lastIndex);
      } else if (isGlob === true) {
        base = "";
        glob = str3;
      } else {
        base = str3;
      }
      if (base && base !== "" && base !== "/" && base !== str3) {
        if (isPathSeparator(base.charCodeAt(base.length - 1))) {
          base = base.slice(0, -1);
        }
      }
      if (opts.unescape === true) {
        if (glob) glob = utils.removeBackslashes(glob);
        if (base && backslashes === true) {
          base = utils.removeBackslashes(base);
        }
      }
      const state = {
        prefix,
        input,
        start,
        base,
        glob,
        isBrace,
        isBracket,
        isGlob,
        isExtglob,
        isGlobstar,
        negated,
        negatedExtglob
      };
      if (opts.tokens === true) {
        state.maxDepth = 0;
        if (!isPathSeparator(code)) {
          tokens.push(token);
        }
        state.tokens = tokens;
      }
      if (opts.parts === true || opts.tokens === true) {
        let prevIndex;
        for (let idx = 0; idx < slashes.length; idx++) {
          const n = prevIndex ? prevIndex + 1 : start;
          const i = slashes[idx];
          const value = input.slice(n, i);
          if (opts.tokens) {
            if (idx === 0 && start !== 0) {
              tokens[idx].isPrefix = true;
              tokens[idx].value = prefix;
            } else {
              tokens[idx].value = value;
            }
            depth(tokens[idx]);
            state.maxDepth += tokens[idx].depth;
          }
          if (idx !== 0 || value !== "") {
            parts.push(value);
          }
          prevIndex = i;
        }
        if (prevIndex && prevIndex + 1 < input.length) {
          const value = input.slice(prevIndex + 1);
          parts.push(value);
          if (opts.tokens) {
            tokens[tokens.length - 1].value = value;
            depth(tokens[tokens.length - 1]);
            state.maxDepth += tokens[tokens.length - 1].depth;
          }
        }
        state.slashes = slashes;
        state.parts = parts;
      }
      return state;
    };
    module.exports = scan;
  }
});

// ../../node_modules/.pnpm/picomatch@4.0.5/node_modules/picomatch/lib/parse.js
var require_parse = __commonJS({
  "../../node_modules/.pnpm/picomatch@4.0.5/node_modules/picomatch/lib/parse.js"(exports, module) {
    "use strict";
    var constants = require_constants();
    var utils = require_utils();
    var {
      MAX_LENGTH,
      POSIX_REGEX_SOURCE,
      REGEX_NON_SPECIAL_CHARS,
      REGEX_SPECIAL_CHARS_BACKREF,
      REPLACEMENTS
    } = constants;
    var expandRange = (args, options) => {
      if (typeof options.expandRange === "function") {
        return options.expandRange(...args, options);
      }
      args.sort();
      const value = `[${args.join("-")}]`;
      try {
        new RegExp(value);
      } catch (ex) {
        return args.map((v) => utils.escapeRegex(v)).join("..");
      }
      return value;
    };
    var syntaxError = (type, char) => {
      return `Missing ${type}: "${char}" - use "\\\\${char}" to match literal characters`;
    };
    var splitTopLevel = (input) => {
      const parts = [];
      let bracket = 0;
      let paren = 0;
      let quote = 0;
      let value = "";
      let escaped = false;
      for (const ch of input) {
        if (escaped === true) {
          value += ch;
          escaped = false;
          continue;
        }
        if (ch === "\\") {
          value += ch;
          escaped = true;
          continue;
        }
        if (ch === '"') {
          quote = quote === 1 ? 0 : 1;
          value += ch;
          continue;
        }
        if (quote === 0) {
          if (ch === "[") {
            bracket++;
          } else if (ch === "]" && bracket > 0) {
            bracket--;
          } else if (bracket === 0) {
            if (ch === "(") {
              paren++;
            } else if (ch === ")" && paren > 0) {
              paren--;
            } else if (ch === "|" && paren === 0) {
              parts.push(value);
              value = "";
              continue;
            }
          }
        }
        value += ch;
      }
      parts.push(value);
      return parts;
    };
    var isPlainBranch = (branch) => {
      let escaped = false;
      for (const ch of branch) {
        if (escaped === true) {
          escaped = false;
          continue;
        }
        if (ch === "\\") {
          escaped = true;
          continue;
        }
        if (/[?*+@!()[\]{}]/.test(ch)) {
          return false;
        }
      }
      return true;
    };
    var normalizeSimpleBranch = (branch) => {
      let value = branch.trim();
      let changed = true;
      while (changed === true) {
        changed = false;
        if (/^@\([^\\()[\]{}|]+\)$/.test(value)) {
          value = value.slice(2, -1);
          changed = true;
        }
      }
      if (!isPlainBranch(value)) {
        return;
      }
      return value.replace(/\\(.)/g, "$1");
    };
    var hasRepeatedCharPrefixOverlap = (branches) => {
      const values = branches.map(normalizeSimpleBranch).filter(Boolean);
      for (let i = 0; i < values.length; i++) {
        for (let j = i + 1; j < values.length; j++) {
          const a = values[i];
          const b = values[j];
          const char = a[0];
          if (!char || a !== char.repeat(a.length) || b !== char.repeat(b.length)) {
            continue;
          }
          if (a === b || a.startsWith(b) || b.startsWith(a)) {
            return true;
          }
        }
      }
      return false;
    };
    var parseRepeatedExtglob = (pattern, requireEnd = true) => {
      if (pattern[0] !== "+" && pattern[0] !== "*" || pattern[1] !== "(") {
        return;
      }
      let bracket = 0;
      let paren = 0;
      let quote = 0;
      let escaped = false;
      for (let i = 1; i < pattern.length; i++) {
        const ch = pattern[i];
        if (escaped === true) {
          escaped = false;
          continue;
        }
        if (ch === "\\") {
          escaped = true;
          continue;
        }
        if (ch === '"') {
          quote = quote === 1 ? 0 : 1;
          continue;
        }
        if (quote === 1) {
          continue;
        }
        if (ch === "[") {
          bracket++;
          continue;
        }
        if (ch === "]" && bracket > 0) {
          bracket--;
          continue;
        }
        if (bracket > 0) {
          continue;
        }
        if (ch === "(") {
          paren++;
          continue;
        }
        if (ch === ")") {
          paren--;
          if (paren === 0) {
            if (requireEnd === true && i !== pattern.length - 1) {
              return;
            }
            return {
              type: pattern[0],
              body: pattern.slice(2, i),
              end: i
            };
          }
        }
      }
    };
    var buildCharClassStar = (chars) => {
      const source = chars.length === 1 ? utils.escapeRegex(chars[0]) : `[${chars.map((ch) => utils.escapeRegex(ch)).join("")}]`;
      return `${source}*`;
    };
    var getStarExtglobSequenceChars = (pattern) => {
      let index = 0;
      const chars = [];
      while (index < pattern.length) {
        const match = parseRepeatedExtglob(pattern.slice(index), false);
        if (!match || match.type !== "*") {
          return;
        }
        const branches = splitTopLevel(match.body).map((branch2) => branch2.trim());
        if (branches.length !== 1) {
          return;
        }
        const branch = normalizeSimpleBranch(branches[0]);
        if (!branch || branch.length !== 1) {
          return;
        }
        chars.push(branch);
        index += match.end + 1;
      }
      if (chars.length < 1) {
        return;
      }
      return chars;
    };
    var repeatedExtglobRecursion = (pattern) => {
      let depth = 0;
      let value = pattern.trim();
      let match = parseRepeatedExtglob(value);
      while (match) {
        depth++;
        value = match.body.trim();
        match = parseRepeatedExtglob(value);
      }
      return depth;
    };
    var analyzeRepeatedExtglob = (body, options) => {
      if (options.maxExtglobRecursion === false) {
        return { risky: false };
      }
      const max = typeof options.maxExtglobRecursion === "number" ? options.maxExtglobRecursion : constants.DEFAULT_MAX_EXTGLOB_RECURSION;
      const branches = splitTopLevel(body).map((branch) => branch.trim());
      if (branches.length > 1) {
        if (branches.some((branch) => branch === "") || branches.some((branch) => /^[*?]+$/.test(branch)) || hasRepeatedCharPrefixOverlap(branches)) {
          return { risky: true };
        }
      }
      const safeChars = [];
      let sawStarSequence = false;
      let combinable = true;
      for (const branch of branches) {
        const chars = getStarExtglobSequenceChars(branch);
        if (chars) {
          sawStarSequence = true;
          safeChars.push(...chars);
          continue;
        }
        const literal = normalizeSimpleBranch(branch);
        if (literal && literal.length === 1) {
          safeChars.push(literal);
          continue;
        }
        combinable = false;
        if (repeatedExtglobRecursion(branch) > max) {
          return { risky: true };
        }
      }
      if (sawStarSequence) {
        return combinable ? { risky: true, safeOutput: buildCharClassStar([...new Set(safeChars)]) } : { risky: true };
      }
      return { risky: false };
    };
    var parse = (input, options) => {
      if (typeof input !== "string") {
        throw new TypeError("Expected a string");
      }
      input = REPLACEMENTS[input] || input;
      const opts = { ...options };
      const max = typeof opts.maxLength === "number" ? Math.min(MAX_LENGTH, opts.maxLength) : MAX_LENGTH;
      let len = input.length;
      if (len > max) {
        throw new SyntaxError(`Input length: ${len}, exceeds maximum allowed length: ${max}`);
      }
      const bos = { type: "bos", value: "", output: opts.prepend || "" };
      const tokens = [bos];
      const capture = opts.capture ? "" : "?:";
      const PLATFORM_CHARS = constants.globChars(opts.windows);
      const EXTGLOB_CHARS = constants.extglobChars(PLATFORM_CHARS);
      const {
        DOT_LITERAL,
        PLUS_LITERAL,
        SLASH_LITERAL,
        ONE_CHAR,
        DOTS_SLASH,
        NO_DOT,
        NO_DOT_SLASH,
        NO_DOTS_SLASH,
        QMARK,
        QMARK_NO_DOT,
        STAR,
        START_ANCHOR
      } = PLATFORM_CHARS;
      const globstar = (opts2) => {
        return `(${capture}(?:(?!${START_ANCHOR}${opts2.dot ? DOTS_SLASH : DOT_LITERAL}).)*?)`;
      };
      const nodot = opts.dot ? "" : NO_DOT;
      const qmarkNoDot = opts.dot ? QMARK : QMARK_NO_DOT;
      let star = opts.bash === true ? globstar(opts) : STAR;
      if (opts.capture) {
        star = `(${star})`;
      }
      if (typeof opts.noext === "boolean") {
        opts.noextglob = opts.noext;
      }
      const state = {
        input,
        index: -1,
        start: 0,
        dot: opts.dot === true,
        consumed: "",
        output: "",
        prefix: "",
        backtrack: false,
        negated: false,
        brackets: 0,
        braces: 0,
        parens: 0,
        quotes: 0,
        globstar: false,
        tokens
      };
      input = utils.removePrefix(input, state);
      len = input.length;
      const extglobs = [];
      const braces = [];
      const stack = [];
      let prev = bos;
      let value;
      const eos = () => state.index === len - 1;
      const peek = state.peek = (n = 1) => input[state.index + n];
      const advance = state.advance = () => input[++state.index] || "";
      const remaining = () => input.slice(state.index + 1);
      const consume = (value2 = "", num2 = 0) => {
        state.consumed += value2;
        state.index += num2;
      };
      const append = (token) => {
        state.output += token.output != null ? token.output : token.value;
        consume(token.value);
      };
      const negate = () => {
        let count = 1;
        while (peek() === "!" && (peek(2) !== "(" || peek(3) === "?")) {
          advance();
          state.start++;
          count++;
        }
        if (count % 2 === 0) {
          return false;
        }
        state.negated = true;
        state.start++;
        return true;
      };
      const increment = (type) => {
        state[type]++;
        stack.push(type);
      };
      const decrement = (type) => {
        state[type]--;
        stack.pop();
      };
      const push = (tok) => {
        if (prev.type === "globstar") {
          const isBrace = state.braces > 0 && (tok.type === "comma" || tok.type === "brace");
          const isExtglob = tok.extglob === true || extglobs.length && (tok.type === "pipe" || tok.type === "paren");
          if (tok.type !== "slash" && tok.type !== "paren" && !isBrace && !isExtglob) {
            state.output = state.output.slice(0, -prev.output.length);
            prev.type = "star";
            prev.value = "*";
            prev.output = star;
            state.output += prev.output;
          }
        }
        if (extglobs.length && tok.type !== "paren") {
          extglobs[extglobs.length - 1].inner += tok.value;
        }
        if (tok.value || tok.output) append(tok);
        if (prev && prev.type === "text" && tok.type === "text") {
          prev.output = (prev.output || prev.value) + tok.value;
          prev.value += tok.value;
          return;
        }
        tok.prev = prev;
        tokens.push(tok);
        prev = tok;
      };
      const extglobOpen = (type, value2) => {
        const token = { ...EXTGLOB_CHARS[value2], conditions: 1, inner: "" };
        token.prev = prev;
        token.parens = state.parens;
        token.output = state.output;
        token.startIndex = state.index;
        token.tokensIndex = tokens.length;
        const output = (opts.capture ? "(" : "") + token.open;
        increment("parens");
        push({ type, value: value2, output: state.output ? "" : ONE_CHAR });
        push({ type: "paren", extglob: true, value: advance(), output });
        extglobs.push(token);
      };
      const extglobClose = (token) => {
        const literal = input.slice(token.startIndex, state.index + 1);
        const body = input.slice(token.startIndex + 2, state.index);
        const analysis = analyzeRepeatedExtglob(body, opts);
        if ((token.type === "plus" || token.type === "star") && analysis.risky) {
          const safeOutput = analysis.safeOutput ? (token.output ? "" : ONE_CHAR) + (opts.capture ? `(${analysis.safeOutput})` : analysis.safeOutput) : void 0;
          const open = tokens[token.tokensIndex];
          open.type = "text";
          open.value = literal;
          open.output = safeOutput || utils.escapeRegex(literal);
          for (let i = token.tokensIndex + 1; i < tokens.length; i++) {
            tokens[i].value = "";
            tokens[i].output = "";
            delete tokens[i].suffix;
          }
          state.output = token.output + open.output;
          state.backtrack = true;
          push({ type: "paren", extglob: true, value, output: "" });
          decrement("parens");
          return;
        }
        let output = token.close + (opts.capture ? ")" : "");
        let rest;
        if (token.type === "negate") {
          let extglobStar = star;
          if (token.inner && token.inner.length > 1 && token.inner.includes("/")) {
            extglobStar = globstar(opts);
          }
          if (extglobStar !== star || eos() || /^\)+$/.test(remaining())) {
            output = token.close = `)$))${extglobStar}`;
          }
          if (token.inner.includes("*") && (rest = remaining()) && /^\.[^\\/.]+$/.test(rest)) {
            const expression = parse(rest, { ...options, fastpaths: false }).output;
            output = token.close = `)${expression})${extglobStar})`;
          }
          if (token.prev.type === "bos") {
            state.negatedExtglob = true;
          }
        }
        push({ type: "paren", extglob: true, value, output });
        decrement("parens");
      };
      if (opts.fastpaths !== false && !/(^[*!]|[/()[\]{}"])/.test(input)) {
        let backslashes = false;
        let output = input.replace(REGEX_SPECIAL_CHARS_BACKREF, (m, esc, chars, first, rest, index) => {
          if (first === "\\") {
            backslashes = true;
            return m;
          }
          if (first === "?") {
            if (esc) {
              return esc + first + (rest ? QMARK.repeat(rest.length) : "");
            }
            if (index === 0) {
              return qmarkNoDot + (rest ? QMARK.repeat(rest.length) : "");
            }
            return QMARK.repeat(chars.length);
          }
          if (first === ".") {
            return DOT_LITERAL.repeat(chars.length);
          }
          if (first === "*") {
            if (esc) {
              return esc + first + (rest ? star : "");
            }
            return star;
          }
          return esc ? m : `\\${m}`;
        });
        if (backslashes === true) {
          if (opts.unescape === true) {
            output = output.replace(/\\/g, "");
          } else {
            output = output.replace(/\\+/g, (m) => {
              return m.length % 2 === 0 ? "\\\\" : m ? "\\" : "";
            });
          }
        }
        if (output === input && opts.contains === true) {
          state.output = input;
          return state;
        }
        state.output = utils.wrapOutput(output, state, options);
        return state;
      }
      while (!eos()) {
        value = advance();
        if (value === "\0") {
          continue;
        }
        if (value === "\\") {
          const next = peek();
          if (next === "/" && opts.bash !== true) {
            continue;
          }
          if (next === "." || next === ";") {
            continue;
          }
          if (!next) {
            value += "\\";
            push({ type: "text", value });
            continue;
          }
          const match = /^\\+/.exec(remaining());
          let slashes = 0;
          if (match && match[0].length > 2) {
            slashes = match[0].length;
            state.index += slashes;
            if (slashes % 2 !== 0) {
              value += "\\";
            }
          }
          if (opts.unescape === true) {
            value = advance();
          } else {
            value += advance();
          }
          if (state.brackets === 0) {
            push({ type: "text", value });
            continue;
          }
        }
        if (state.brackets > 0 && (value !== "]" || prev.value === "[" || prev.value === "[^")) {
          if (opts.posix !== false && value === ":") {
            const inner = prev.value.slice(1);
            if (inner.includes("[")) {
              prev.posix = true;
              if (inner.includes(":")) {
                const idx = prev.value.lastIndexOf("[");
                const pre = prev.value.slice(0, idx);
                const rest2 = prev.value.slice(idx + 2);
                const posix = POSIX_REGEX_SOURCE[rest2];
                if (posix) {
                  prev.value = pre + posix;
                  state.backtrack = true;
                  advance();
                  if (!bos.output && tokens.indexOf(prev) === 1) {
                    bos.output = ONE_CHAR;
                  }
                  continue;
                }
              }
            }
          }
          if (value === "[" && peek() !== ":" || value === "-" && peek() === "]") {
            value = `\\${value}`;
          }
          if (value === "]" && (prev.value === "[" || prev.value === "[^")) {
            value = `\\${value}`;
          }
          if (opts.posix === true && value === "!" && prev.value === "[") {
            value = "^";
          }
          prev.value += value;
          append({ value });
          continue;
        }
        if (state.quotes === 1 && value !== '"') {
          value = utils.escapeRegex(value);
          prev.value += value;
          append({ value });
          continue;
        }
        if (value === '"') {
          state.quotes = state.quotes === 1 ? 0 : 1;
          if (opts.keepQuotes === true) {
            push({ type: "text", value });
          }
          continue;
        }
        if (value === "(") {
          increment("parens");
          push({ type: "paren", value });
          continue;
        }
        if (value === ")") {
          if (state.parens === 0 && opts.strictBrackets === true) {
            throw new SyntaxError(syntaxError("opening", "("));
          }
          const extglob = extglobs[extglobs.length - 1];
          if (extglob && state.parens === extglob.parens + 1) {
            extglobClose(extglobs.pop());
            continue;
          }
          push({ type: "paren", value, output: state.parens ? ")" : "\\)" });
          decrement("parens");
          continue;
        }
        if (value === "[") {
          if (opts.nobracket === true || !remaining().includes("]")) {
            if (opts.nobracket !== true && opts.strictBrackets === true) {
              throw new SyntaxError(syntaxError("closing", "]"));
            }
            value = `\\${value}`;
          } else {
            increment("brackets");
          }
          push({ type: "bracket", value });
          continue;
        }
        if (value === "]") {
          if (opts.nobracket === true || prev && prev.type === "bracket" && prev.value.length === 1) {
            push({ type: "text", value, output: `\\${value}` });
            continue;
          }
          if (state.brackets === 0) {
            if (opts.strictBrackets === true) {
              throw new SyntaxError(syntaxError("opening", "["));
            }
            push({ type: "text", value, output: `\\${value}` });
            continue;
          }
          decrement("brackets");
          const prevValue = prev.value.slice(1);
          if (prev.posix !== true && prevValue[0] === "^" && !prevValue.includes("/")) {
            value = `/${value}`;
          }
          prev.value += value;
          append({ value });
          if (opts.literalBrackets === false || utils.hasRegexChars(prevValue)) {
            continue;
          }
          const escaped = utils.escapeRegex(prev.value);
          state.output = state.output.slice(0, -prev.value.length);
          if (opts.literalBrackets === true) {
            state.output += escaped;
            prev.value = escaped;
            continue;
          }
          prev.value = `(${capture}${escaped}|${prev.value})`;
          state.output += prev.value;
          continue;
        }
        if (value === "{" && opts.nobrace !== true) {
          increment("braces");
          const open = {
            type: "brace",
            value,
            output: "(",
            outputIndex: state.output.length,
            tokensIndex: state.tokens.length
          };
          braces.push(open);
          push(open);
          continue;
        }
        if (value === "}") {
          const brace = braces[braces.length - 1];
          if (opts.nobrace === true || !brace) {
            push({ type: "text", value, output: value });
            continue;
          }
          let output = ")";
          if (brace.dots === true) {
            const arr = tokens.slice();
            const range = [];
            for (let i = arr.length - 1; i >= 0; i--) {
              tokens.pop();
              if (arr[i].type === "brace") {
                break;
              }
              if (arr[i].type !== "dots") {
                range.unshift(arr[i].value);
              }
            }
            output = expandRange(range, opts);
            state.backtrack = true;
          }
          if (brace.comma !== true && brace.dots !== true) {
            const out = state.output.slice(0, brace.outputIndex);
            const toks = state.tokens.slice(brace.tokensIndex);
            brace.value = brace.output = "\\{";
            value = output = "\\}";
            state.output = out;
            for (const t of toks) {
              state.output += t.output || t.value;
            }
          }
          push({ type: "brace", value, output });
          decrement("braces");
          braces.pop();
          continue;
        }
        if (value === "|") {
          if (extglobs.length > 0) {
            extglobs[extglobs.length - 1].conditions++;
          }
          push({ type: "text", value });
          continue;
        }
        if (value === ",") {
          let output = value;
          const brace = braces[braces.length - 1];
          if (brace && stack[stack.length - 1] === "braces") {
            brace.comma = true;
            output = "|";
          }
          push({ type: "comma", value, output });
          continue;
        }
        if (value === "/") {
          if (prev.type === "dot" && state.index === state.start + 1) {
            state.start = state.index + 1;
            state.consumed = "";
            state.output = "";
            tokens.pop();
            prev = bos;
            continue;
          }
          push({ type: "slash", value, output: SLASH_LITERAL });
          continue;
        }
        if (value === ".") {
          if (state.braces > 0 && prev.type === "dot") {
            if (prev.value === ".") prev.output = DOT_LITERAL;
            const brace = braces[braces.length - 1];
            prev.type = "dots";
            prev.output += value;
            prev.value += value;
            brace.dots = true;
            continue;
          }
          if (state.braces + state.parens === 0 && prev.type !== "bos" && prev.type !== "slash") {
            push({ type: "text", value, output: DOT_LITERAL });
            continue;
          }
          push({ type: "dot", value, output: DOT_LITERAL });
          continue;
        }
        if (value === "?") {
          const isGroup = prev && prev.value === "(";
          if (!isGroup && opts.noextglob !== true && peek() === "(" && peek(2) !== "?") {
            extglobOpen("qmark", value);
            continue;
          }
          if (prev && prev.type === "paren") {
            const next = peek();
            let output = value;
            if (prev.value === "(" && !/[!=<:]/.test(next) || next === "<" && !/<([!=]|\w+>)/.test(remaining())) {
              output = `\\${value}`;
            }
            push({ type: "text", value, output });
            continue;
          }
          if (opts.dot !== true && (prev.type === "slash" || prev.type === "bos")) {
            push({ type: "qmark", value, output: QMARK_NO_DOT });
            continue;
          }
          push({ type: "qmark", value, output: QMARK });
          continue;
        }
        if (value === "!") {
          if (opts.noextglob !== true && peek() === "(") {
            if (peek(2) !== "?" || !/[!=<:]/.test(peek(3))) {
              extglobOpen("negate", value);
              continue;
            }
          }
          if (opts.nonegate !== true && state.index === 0) {
            negate();
            continue;
          }
        }
        if (value === "+") {
          if (opts.noextglob !== true && peek() === "(" && peek(2) !== "?") {
            extglobOpen("plus", value);
            continue;
          }
          if (prev && prev.value === "(" || opts.regex === false) {
            push({ type: "plus", value, output: PLUS_LITERAL });
            continue;
          }
          if (prev && (prev.type === "bracket" || prev.type === "paren" || prev.type === "brace") || state.parens > 0) {
            push({ type: "plus", value });
            continue;
          }
          push({ type: "plus", value: PLUS_LITERAL });
          continue;
        }
        if (value === "@") {
          if (opts.noextglob !== true && peek() === "(" && peek(2) !== "?") {
            push({ type: "at", extglob: true, value, output: "" });
            continue;
          }
          push({ type: "text", value });
          continue;
        }
        if (value !== "*") {
          if (value === "$" || value === "^") {
            value = `\\${value}`;
          }
          const match = REGEX_NON_SPECIAL_CHARS.exec(remaining());
          if (match) {
            value += match[0];
            state.index += match[0].length;
          }
          push({ type: "text", value });
          continue;
        }
        if (prev && (prev.type === "globstar" || prev.star === true)) {
          prev.type = "star";
          prev.star = true;
          prev.value += value;
          prev.output = star;
          state.backtrack = true;
          state.globstar = true;
          consume(value);
          continue;
        }
        let rest = remaining();
        if (opts.noextglob !== true && /^\([^?]/.test(rest)) {
          extglobOpen("star", value);
          continue;
        }
        if (prev.type === "star") {
          if (opts.noglobstar === true) {
            consume(value);
            continue;
          }
          const prior = prev.prev;
          const before = prior.prev;
          const isStart = prior.type === "slash" || prior.type === "bos";
          const afterStar = before && (before.type === "star" || before.type === "globstar");
          if (opts.bash === true && (!isStart || rest[0] && rest[0] !== "/")) {
            push({ type: "star", value, output: "" });
            continue;
          }
          const isBrace = state.braces > 0 && (prior.type === "comma" || prior.type === "brace");
          const isExtglob = extglobs.length && (prior.type === "pipe" || prior.type === "paren");
          if (!isStart && prior.type !== "paren" && !isBrace && !isExtglob) {
            push({ type: "star", value, output: "" });
            continue;
          }
          while (rest.slice(0, 3) === "/**") {
            const after = input[state.index + 4];
            if (after && after !== "/") {
              break;
            }
            rest = rest.slice(3);
            consume("/**", 3);
          }
          if (prior.type === "bos" && eos()) {
            prev.type = "globstar";
            prev.value += value;
            prev.output = globstar(opts);
            state.output = prev.output;
            state.globstar = true;
            consume(value);
            continue;
          }
          if (prior.type === "slash" && prior.prev.type !== "bos" && !afterStar && eos()) {
            state.output = state.output.slice(0, -(prior.output + prev.output).length);
            prior.output = `(?:${prior.output}`;
            prev.type = "globstar";
            prev.output = globstar(opts) + (opts.strictSlashes ? ")" : "|$)");
            prev.value += value;
            state.globstar = true;
            state.output += prior.output + prev.output;
            consume(value);
            continue;
          }
          if (prior.type === "slash" && prior.prev.type !== "bos" && rest[0] === "/") {
            const end = rest[1] !== void 0 ? "|$" : "";
            state.output = state.output.slice(0, -(prior.output + prev.output).length);
            prior.output = `(?:${prior.output}`;
            prev.type = "globstar";
            prev.output = `${globstar(opts)}${SLASH_LITERAL}|${SLASH_LITERAL}${end})`;
            prev.value += value;
            state.output += prior.output + prev.output;
            state.globstar = true;
            consume(value + advance());
            push({ type: "slash", value: "/", output: "" });
            continue;
          }
          if (prior.type === "bos" && rest[0] === "/") {
            prev.type = "globstar";
            prev.value += value;
            prev.output = `(?:^|${SLASH_LITERAL}|${globstar(opts)}${SLASH_LITERAL})`;
            state.output = prev.output;
            state.globstar = true;
            consume(value + advance());
            push({ type: "slash", value: "/", output: "" });
            continue;
          }
          state.output = state.output.slice(0, -prev.output.length);
          prev.type = "globstar";
          prev.output = globstar(opts);
          prev.value += value;
          state.output += prev.output;
          state.globstar = true;
          consume(value);
          continue;
        }
        const token = { type: "star", value, output: star };
        if (opts.bash === true) {
          token.output = ".*?";
          if (prev.type === "bos" || prev.type === "slash") {
            token.output = nodot + token.output;
          }
          push(token);
          continue;
        }
        if (prev && (prev.type === "bracket" || prev.type === "paren") && opts.regex === true) {
          token.output = value;
          push(token);
          continue;
        }
        if (state.index === state.start || prev.type === "slash" || prev.type === "dot") {
          if (prev.type === "dot") {
            state.output += NO_DOT_SLASH;
            prev.output += NO_DOT_SLASH;
          } else if (opts.dot === true) {
            state.output += NO_DOTS_SLASH;
            prev.output += NO_DOTS_SLASH;
          } else {
            state.output += nodot;
            prev.output += nodot;
          }
          if (peek() !== "*") {
            state.output += ONE_CHAR;
            prev.output += ONE_CHAR;
          }
        }
        push(token);
      }
      while (state.brackets > 0) {
        if (opts.strictBrackets === true) throw new SyntaxError(syntaxError("closing", "]"));
        state.output = utils.escapeLast(state.output, "[");
        decrement("brackets");
      }
      while (state.parens > 0) {
        if (opts.strictBrackets === true) throw new SyntaxError(syntaxError("closing", ")"));
        state.output = utils.escapeLast(state.output, "(");
        decrement("parens");
      }
      while (state.braces > 0) {
        if (opts.strictBrackets === true) throw new SyntaxError(syntaxError("closing", "}"));
        state.output = utils.escapeLast(state.output, "{");
        decrement("braces");
      }
      if (opts.strictSlashes !== true && (prev.type === "star" || prev.type === "bracket")) {
        push({ type: "maybe_slash", value: "", output: `${SLASH_LITERAL}?` });
      }
      if (state.backtrack === true) {
        state.output = "";
        for (const token of state.tokens) {
          state.output += token.output != null ? token.output : token.value;
          if (token.suffix) {
            state.output += token.suffix;
          }
        }
      }
      return state;
    };
    parse.fastpaths = (input, options) => {
      const opts = { ...options };
      const max = typeof opts.maxLength === "number" ? Math.min(MAX_LENGTH, opts.maxLength) : MAX_LENGTH;
      const len = input.length;
      if (len > max) {
        throw new SyntaxError(`Input length: ${len}, exceeds maximum allowed length: ${max}`);
      }
      input = REPLACEMENTS[input] || input;
      const {
        DOT_LITERAL,
        SLASH_LITERAL,
        ONE_CHAR,
        DOTS_SLASH,
        NO_DOT,
        NO_DOTS,
        NO_DOTS_SLASH,
        STAR,
        START_ANCHOR
      } = constants.globChars(opts.windows);
      const nodot = opts.dot ? NO_DOTS : NO_DOT;
      const slashDot = opts.dot ? NO_DOTS_SLASH : NO_DOT;
      const capture = opts.capture ? "" : "?:";
      const state = { negated: false, prefix: "" };
      let star = opts.bash === true ? ".*?" : STAR;
      if (opts.capture) {
        star = `(${star})`;
      }
      const globstar = (opts2) => {
        if (opts2.noglobstar === true) return star;
        return `(${capture}(?:(?!${START_ANCHOR}${opts2.dot ? DOTS_SLASH : DOT_LITERAL}).)*?)`;
      };
      const create = (str3) => {
        switch (str3) {
          case "*":
            return `${nodot}${ONE_CHAR}${star}`;
          case ".*":
            return `${DOT_LITERAL}${ONE_CHAR}${star}`;
          case "*.*":
            return `${nodot}${star}${DOT_LITERAL}${ONE_CHAR}${star}`;
          case "*/*":
            return `${nodot}${star}${SLASH_LITERAL}${ONE_CHAR}${slashDot}${star}`;
          case "**":
            return nodot + globstar(opts);
          case "**/*":
            return `(?:${nodot}${globstar(opts)}${SLASH_LITERAL})?${slashDot}${ONE_CHAR}${star}`;
          case "**/*.*":
            return `(?:${nodot}${globstar(opts)}${SLASH_LITERAL})?${slashDot}${star}${DOT_LITERAL}${ONE_CHAR}${star}`;
          case "**/.*":
            return `(?:${nodot}${globstar(opts)}${SLASH_LITERAL})?${DOT_LITERAL}${ONE_CHAR}${star}`;
          default: {
            const match = /^(.*?)\.(\w+)$/.exec(str3);
            if (!match) return;
            const source2 = create(match[1]);
            if (!source2) return;
            return source2 + DOT_LITERAL + match[2];
          }
        }
      };
      const output = utils.removePrefix(input, state);
      let source = create(output);
      if (source && opts.strictSlashes !== true) {
        source += `${SLASH_LITERAL}?`;
      }
      return source;
    };
    module.exports = parse;
  }
});

// ../../node_modules/.pnpm/picomatch@4.0.5/node_modules/picomatch/lib/picomatch.js
var require_picomatch = __commonJS({
  "../../node_modules/.pnpm/picomatch@4.0.5/node_modules/picomatch/lib/picomatch.js"(exports, module) {
    "use strict";
    var scan = require_scan();
    var parse = require_parse();
    var utils = require_utils();
    var constants = require_constants();
    var isObject = (val) => val && typeof val === "object" && !Array.isArray(val);
    var picomatch3 = (glob, options, returnState = false) => {
      if (Array.isArray(glob)) {
        const fns = glob.map((input) => picomatch3(input, options, returnState));
        const arrayMatcher = (str3) => {
          for (const isMatch of fns) {
            const state2 = isMatch(str3);
            if (state2) return state2;
          }
          return false;
        };
        return arrayMatcher;
      }
      const isState = isObject(glob) && glob.tokens && glob.input;
      if (glob === "" || typeof glob !== "string" && !isState) {
        throw new TypeError("Expected pattern to be a non-empty string");
      }
      const opts = options || {};
      const posix = opts.windows;
      const regex = isState ? picomatch3.compileRe(glob, options) : picomatch3.makeRe(glob, options, false, true);
      const state = regex.state;
      delete regex.state;
      let isIgnored = () => false;
      if (opts.ignore) {
        const ignoreOpts = { ...options, ignore: null, onMatch: null, onResult: null };
        isIgnored = picomatch3(opts.ignore, ignoreOpts, returnState);
      }
      const matcher = (input, returnObject = false) => {
        const { isMatch, match, output } = picomatch3.test(input, regex, options, { glob, posix });
        const result = { glob, state, regex, posix, input, output, match, isMatch };
        if (typeof opts.onResult === "function") {
          opts.onResult(result);
        }
        if (isMatch === false) {
          result.isMatch = false;
          return returnObject ? result : false;
        }
        if (isIgnored(input)) {
          if (typeof opts.onIgnore === "function") {
            opts.onIgnore(result);
          }
          result.isMatch = false;
          return returnObject ? result : false;
        }
        if (typeof opts.onMatch === "function") {
          opts.onMatch(result);
        }
        return returnObject ? result : true;
      };
      if (returnState) {
        matcher.state = state;
      }
      return matcher;
    };
    picomatch3.test = (input, regex, options, { glob, posix } = {}) => {
      if (typeof input !== "string") {
        throw new TypeError("Expected input to be a string");
      }
      if (input === "") {
        return { isMatch: false, output: "" };
      }
      const opts = options || {};
      const format = opts.format || (posix ? utils.toPosixSlashes : null);
      let match = input === glob;
      let output = match && format ? format(input) : input;
      if (match === false) {
        output = format ? format(input) : input;
        match = output === glob;
      }
      if (match === false || opts.capture === true) {
        if (opts.matchBase === true || opts.basename === true) {
          match = picomatch3.matchBase(input, regex, options, posix);
        } else {
          match = regex.exec(output);
        }
      }
      return { isMatch: Boolean(match), match, output };
    };
    picomatch3.matchBase = (input, glob, options, posix = options && options.windows) => {
      const regex = glob instanceof RegExp ? glob : picomatch3.makeRe(glob, options);
      return regex.test(utils.basename(input, { windows: posix }));
    };
    picomatch3.isMatch = (str3, patterns, options) => picomatch3(patterns, options)(str3);
    picomatch3.parse = (pattern, options) => {
      if (Array.isArray(pattern)) return pattern.map((p) => picomatch3.parse(p, options));
      return parse(pattern, { ...options, fastpaths: false });
    };
    picomatch3.scan = (input, options) => scan(input, options);
    picomatch3.compileRe = (state, options, returnOutput = false, returnState = false) => {
      if (returnOutput === true) {
        return state.output;
      }
      const opts = options || {};
      const prepend = opts.contains ? "" : "^";
      const append = opts.contains ? "" : "$";
      let source = `${prepend}(?:${state.output})${append}`;
      if (state && state.negated === true) {
        source = `^(?!${source}).*$`;
      }
      const regex = picomatch3.toRegex(source, options);
      if (returnState === true) {
        regex.state = state;
      }
      return regex;
    };
    picomatch3.makeRe = (input, options = {}, returnOutput = false, returnState = false) => {
      if (!input || typeof input !== "string") {
        throw new TypeError("Expected a non-empty string");
      }
      let parsed = { negated: false, fastpaths: true };
      if (options.fastpaths !== false && (input[0] === "." || input[0] === "*")) {
        parsed.output = parse.fastpaths(input, options);
      }
      if (!parsed.output) {
        parsed = parse(input, options);
      }
      return picomatch3.compileRe(parsed, options, returnOutput, returnState);
    };
    picomatch3.toRegex = (source, options) => {
      try {
        const opts = options || {};
        return new RegExp(source, opts.flags || (opts.nocase ? "i" : ""));
      } catch (err) {
        if (options && options.debug === true) throw err;
        return /$^/;
      }
    };
    picomatch3.constants = constants;
    module.exports = picomatch3;
  }
});

// ../../node_modules/.pnpm/picomatch@4.0.5/node_modules/picomatch/index.js
var require_picomatch2 = __commonJS({
  "../../node_modules/.pnpm/picomatch@4.0.5/node_modules/picomatch/index.js"(exports, module) {
    "use strict";
    var pico = require_picomatch();
    var utils = require_utils();
    function picomatch3(glob, options, returnState = false) {
      if (options && (options.windows === null || options.windows === void 0)) {
        options = { ...options, windows: utils.isWindows() };
      }
      return pico(glob, options, returnState);
    }
    Object.assign(picomatch3, pico);
    module.exports = picomatch3;
  }
});

// ../../apps/mcp/src/tools-list.ts
function toolsForScope(tools, scope) {
  const suffix = "error" in scope ? `

SCOPE: this server has not resolved a board. ${scope.error.split("\n")[0]} Until it does, it answers nothing \u2014 and another CommitCycle server registered beside it may still be answering for a board that is not this checkout's (CC-448).` : `

SCOPE: answers for \`${scope.tenant}/${scope.repo}\`` + (scope.apiUrl ? ` at ${scope.apiUrl.replace(/\/+$/, "")}` : "") + (scope.origin ? `, resolved from ${scope.origin}` : "") + ". More than one CommitCycle server can be registered in a session and each answers for whatever board it resolved: read this line before trusting a payload, because task ids are shaped the same on every board (D-49, CC-448).";
  return tools.map((t) => ({ ...t, description: t.description + suffix }));
}
var TOOLS;
var init_tools_list = __esm({
  "../../apps/mcp/src/tools-list.ts"() {
    "use strict";
    TOOLS = [
      {
        name: "cc_zones",
        description: "The zone map for this repository: which areas are protected, at what risk, and who owns each. Read this before proposing which zones a task touches \u2014 declaring a zone that is not needed costs a real person a real approval.",
        inputSchema: { type: "object", properties: {}, additionalProperties: false }
      },
      {
        name: "cc_intake",
        description: "File a request on the board in one line. It lands in Triage; it does not start anything. Use this the moment work is asked for, before scoping it \u2014 a request that has not been scoped is not work in progress.",
        inputSchema: {
          type: "object",
          properties: {
            title: { type: "string", description: "One line. What is being asked for." },
            requested_by: { type: "string", description: "Email or name of whoever asked." }
          },
          required: ["title"],
          additionalProperties: false
        }
      },
      {
        name: "cc_interview",
        description: "Draft the four fields for a task: what it should do, what it must NOT do, which zones it touches, and how we will know it worked. The board validates every draft against the real zone map before returning it.\n\nPRESENT THE RESULT AS CHOICES, NOT AS A FAIT ACCOMPLI: offer each suggestion as a selectable option alongside a free-text alternative, and let the person correct it. The draft is a starting point for a conversation, not an answer.",
        inputSchema: {
          type: "object",
          properties: { task_id: { type: "string" }, title: { type: "string" } },
          additionalProperties: false
        }
      },
      {
        name: "cc_scope",
        description: "Save the four answers onto a task. This does not start the work: the gate is the only way into In Progress, and it runs on the board. After this, the task is ready for a person to start it \u2014 and any high-risk zone it declares will ask its owner first.",
        inputSchema: {
          type: "object",
          properties: {
            task_id: { type: "string" },
            goal: { type: "string", description: "What it should do." },
            non_goals: { type: "string", description: "What it must NOT do \u2014 the field that prevents most accidents." },
            acceptance_criteria: { type: "array", items: { type: "string" } },
            affected_zones: {
              type: "array",
              items: {
                type: "object",
                properties: { id: { type: "string" }, mode: { type: "string", enum: ["read", "write"] } },
                required: ["id", "mode"]
              }
            },
            quality_gate: { type: "string", enum: ["none", "visual review", "API contract check", "regression suite", "QA sign-off"] },
            mode: { type: "string", enum: ["standard", "spike"] },
            topics: {
              type: "array",
              items: { type: "string" },
              description: "The disciplines this task needs (D-45). Advisory: each loads its playbook for the agent; none blocks."
            },
            priority: {
              type: "string",
              enum: ["urgent", "high", "medium", "low", "none"],
              description: "Linear scale (D-44). A triage property \u2014 intake stays one line."
            }
          },
          required: ["task_id"],
          additionalProperties: false
        }
      },
      {
        name: "cc_status",
        description: "What is on the board. With a task_id: that one task, as a full record. With none: a projection of what is in flight \u2014 id, title, state, branch, affected_zones and updated_at per task, not the full records (each is one `cc_status task_id` call away). Pass `state` to narrow the whole-board read to a single state. Read-only. For what is open to you on this machine right now, run `cycle status` \u2014 the grant is local and this server deliberately cannot see it.",
        inputSchema: {
          type: "object",
          properties: {
            task_id: { type: "string", description: "One task, returned as a full record." },
            state: {
              type: "string",
              enum: ["Triage", "Todo", "In Progress", "In Review", "Done", "Canceled"],
              description: "Whole-board read only: narrow the projection to one state. Ignored when task_id is given. Default is what is in flight \u2014 In Progress and In Review."
            }
          },
          additionalProperties: false
        }
      }
    ];
  }
});

// ../../apps/mcp/src/status.ts
function scopeMismatch(scope, checkout) {
  if (!checkout?.tenant || !checkout.repo) return null;
  const here = scopeLabel(scope);
  const there = `${checkout.tenant}/${checkout.repo}`;
  const sameUrl = !checkout.apiUrl || !scope.apiUrl || trimUrl(checkout.apiUrl) === trimUrl(scope.apiUrl);
  if (here === there && sameUrl) return null;
  return `SCOPE MISMATCH \u2014 this is not the board this checkout reports to. This server answers for ${here}${at(scope.apiUrl)}${scope.origin ? `, resolved from ${scope.origin}` : ""}. The checkout at ${checkout.path} reports to ${there}${at(checkout.apiUrl)}. Task ids are shaped the same on every board (D-49), so what follows will parse and will not be this repository's work \u2014 do not assess collisions, holders or anything else against it. Point the client at \`cycle mcp\` from this checkout, or set CC_API_URL / CC_TENANT / CC_REPO_ID on this server to ${there}.`;
}
function statusHeader(scope, checkout) {
  return {
    answering_for: scopeLabel(scope),
    board: {
      tenant: scope.tenant,
      repo: scope.repo,
      api_url: scope.apiUrl ? trimUrl(scope.apiUrl) : null,
      resolved_from: scope.origin ?? null
    },
    checkout: checkout ? {
      path: checkout.path,
      reports_to: checkout.tenant && checkout.repo ? `${checkout.tenant}/${checkout.repo}` : null,
      api_url: checkout.apiUrl ? trimUrl(checkout.apiUrl) : null
    } : null,
    scope_warning: scopeMismatch(scope, checkout)
  };
}
function boardStatus(scope, checkout, tasks, queriedAt) {
  const { answering_for, ...rest } = statusHeader(scope, checkout);
  return { answering_for, queried_at: queriedAt, ...rest, in_flight: tasks.length, tasks: [...tasks] };
}
function taskStatus(scope, checkout, task) {
  return { ...statusHeader(scope, checkout), task };
}
function projectTask(t) {
  return {
    id: t.id,
    title: t.title,
    state: t.state,
    branch: t.branch,
    affected_zones: t.affected_zones,
    updated_at: t.updated_at
  };
}
var scopeLabel, trimUrl, at, noSuchTask;
var init_status = __esm({
  "../../apps/mcp/src/status.ts"() {
    "use strict";
    scopeLabel = (s) => `${s.tenant}/${s.repo}`;
    trimUrl = (u) => u.replace(/\/+$/, "");
    at = (url) => url ? ` at ${trimUrl(url)}` : "";
    noSuchTask = (scope, id) => `No task ${id} on ${scopeLabel(scope)}${at(scope.apiUrl)}. If that id exists somewhere, it exists on another board \u2014 this server answers for one.`;
  }
});

// ../../apps/mcp/src/api.ts
function scopeFromEnv(env = process.env) {
  const apiUrl = env.CC_API_URL;
  if (!apiUrl) {
    return { error: "CC_API_URL is not set \u2014 point it at the board this repository reports to." };
  }
  const tenant = env.CC_TENANT;
  if (!tenant) {
    return {
      error: "CC_TENANT is not set. There is no default worth having: a guess writes into a tenant nobody created. It is the first half of the address in the console \u2014 `pow/commitcycle` means CC_TENANT=pow."
    };
  }
  const repo = env.CC_REPO_ID;
  if (!repo) {
    return {
      error: "CC_REPO_ID is not set. There is no default worth having: a guess writes into a repository nobody created, and defaulting to this product's own is how a customer's tasks land on a board that reads back empty. It is the second half of the address in the console \u2014 `pow/commitcycle` means CC_REPO_ID=commitcycle. Or point the client at `cycle mcp`, which resolves the repository from the checkout beside it."
    };
  }
  return { apiUrl: apiUrl.replace(/\/+$/, ""), tenant, repo, token: env.CC_TOKEN };
}
async function call(scope, path, init) {
  const headers = { "content-type": "application/json" };
  if (scope.token) headers.authorization = `Bearer ${scope.token}`;
  const url = `${scope.apiUrl}/v1/${scope.tenant}/${scope.repo}${path}`;
  const res = await fetch(url, { ...init, headers: { ...headers, ...init?.headers } });
  if (!res.ok) {
    let detail = `${res.status}`;
    try {
      const body = await res.json();
      detail = joinMessages(body.failures) ?? joinMessages(body.problems) ?? body.error ?? body.message ?? detail;
    } catch {
    }
    if ((res.status === 401 || res.status === 403) && !scope.token) {
      throw new BoardError(
        `${detail}

This server holds no credential. It was started without CC_TOKEN, which is the only source this entry point reads \u2014 the session \`cycle login\` stores is a file it never opens. Point the client at \`cycle mcp\` instead: it walks the same four sources every other command does (CC_TOKEN, .zones/board.json, this machine's pairing, then the stored session). Setting CC_TOKEN in this server's environment also works, and is the only option when the CLI is absent.`,
        res.status
      );
    }
    throw new BoardError(detail, res.status);
  }
  return await res.json();
}
var BoardError, joinMessages, board;
var init_api = __esm({
  "../../apps/mcp/src/api.ts"() {
    "use strict";
    BoardError = class extends Error {
      constructor(message, status) {
        super(message);
        this.status = status;
        this.name = "BoardError";
      }
    };
    joinMessages = (items) => items && items.length ? items.map((m) => m.message).join(" ") : void 0;
    board = {
      /** One line in, one unscoped task in Triage out. */
      async intake(scope, title, requestedBy) {
        const { task } = await call(scope, "/tasks", {
          method: "POST",
          body: JSON.stringify({ title, requested_by: requestedBy })
        });
        return task;
      },
      async task(scope, id) {
        const { task } = await call(scope, `/tasks/${id}`);
        return task;
      },
      async tasks(scope) {
        const { tasks } = await call(scope, "/tasks");
        return tasks;
      },
      async zones(scope) {
        const { zones } = await call(scope, "/zones");
        return zones;
      },
      /**
       * Fill in the four fields. The board refuses `state` on this route, so this
       * cannot start work however it is called — the gate stays the only way in.
       */
      async scope(scope, id, patch) {
        const { task } = await call(scope, `/tasks/${id}`, {
          method: "PUT",
          body: JSON.stringify(patch)
        });
        return task;
      },
      /**
       * The interview (T3.4). Its output passes the board's D-28 validator before
       * it comes back, so what arrives here has already been reconciled against the
       * real zone map — this file must not "help" by patching it.
       */
      async interview(scope, request) {
        return call(scope, "/interview", {
          /* `request`, which is what the route reads (CC-124).
           *
           * This sent `{ title }`, so every call was refused with "request is
           * required" before the model was reached — `cc_interview` has never
           * returned a draft to any session since the server was built. It failed
           * in the one way nobody chases: the board's own message came back as the
           * tool's answer, so it read like the board declining rather than like the
           * client asking wrong.
           *
           * The route is not the thing to change. Teaching the server to accept
           * both spellings would leave two names for one field forever, and the
           * caller is what is wrong here. */
          method: "POST",
          body: JSON.stringify({ request })
        });
      }
    };
  }
});

// ../../apps/mcp/src/checkout.ts
import { existsSync as existsSync24, readFileSync as readFileSync28 } from "node:fs";
import { dirname as dirname15, join as join31, resolve as resolve5 } from "node:path";
function readCheckoutBinding(from = process.cwd()) {
  let dir = resolve5(from);
  for (; ; ) {
    const file = join31(dir, ".zones", "board.json");
    if (existsSync24(file)) {
      try {
        const j = JSON.parse(readFileSync28(file, "utf8"));
        return { path: file, tenant: str2(j.tenant), repo: str2(j.repo), apiUrl: str2(j.api_url) };
      } catch {
        return { path: file };
      }
    }
    const up = dirname15(dir);
    if (up === dir) return null;
    dir = up;
  }
}
function scopeOrigin(env = process.env) {
  return env.CC_API_URL || env.CC_TENANT || env.CC_REPO_ID ? "this server's own environment (CC_API_URL / CC_TENANT / CC_REPO_ID)" : "the CommitCycle CLI beside it (.zones/board.json, this machine's pairing, then the stored session)";
}
var str2;
var init_checkout = __esm({
  "../../apps/mcp/src/checkout.ts"() {
    "use strict";
    str2 = (v) => typeof v === "string" && v ? v : void 0;
  }
});

// ../../apps/mcp/src/server.ts
var server_exports = {};
__export(server_exports, {
  TOOLS: () => TOOLS,
  handle: () => handle2,
  main: () => main,
  runTool: () => runTool,
  toolsForScope: () => toolsForScope
});
import { createInterface as createInterface2 } from "node:readline";
async function runTool(scope, name, args, readCheckout = readCheckoutBinding) {
  switch (name) {
    case "cc_zones":
      return JSON.stringify(await board.zones(scope), null, 2);
    case "cc_intake": {
      const title = String(args.title ?? "").trim();
      if (!title) return "A title is required \u2014 one line is enough.";
      const task = await board.intake(scope, title, String(args.requested_by ?? "agent"));
      return `Filed ${task.id} in Triage: ${task.title}

It cannot start until the four questions are answered. Use cc_interview to draft them, then confirm each answer with the person before cc_scope.`;
    }
    case "cc_interview": {
      let title;
      if (args.title) {
        title = String(args.title);
      } else {
        const id = String(args.task_id ?? "").trim();
        if (!id) return "Which task? cc_interview needs a task_id, or a title to draft from.";
        try {
          title = (await board.task(scope, id)).title;
        } catch (e) {
          if (e instanceof BoardError && e.status === 404) return noSuchTask(announced(scope), id);
          throw e;
        }
      }
      const draft = await board.interview(scope, title);
      return JSON.stringify(draft, null, 2) + "\n\nThese are suggestions, already checked against the real zone map. Offer them as options with a free-text alternative rather than saving them as they are.";
    }
    case "cc_scope": {
      const { task_id, ...patch } = args;
      if (!task_id) return "Which task? cc_scope needs a task_id.";
      const task = await board.scope(scope, String(task_id), patch);
      const missing = [
        !task.goal && "what it should do",
        !task.non_goals && "what it must NOT do",
        !task.acceptance_criteria?.length && "how we know it worked"
      ].filter(Boolean);
      return missing.length ? `Saved ${task.id}. Still unanswered: ${missing.join(", ")}. The gate will refuse until they are.` : `Saved ${task.id}. All four answered \u2014 a person can start it from the board now.`;
    }
    /* Both shapes are built in `status.ts` and both begin with the board they
       answer for (CC-448). This used to return `{ in_flight, tasks }` where the
       Worker returned a bare array, so a parse written against one broke on the
       other; and neither said which board it had read, which is how 65 tasks
       from another organization's product came back looking like this
       repository's. */
    case "cc_status": {
      const here = announced(scope);
      const checkout = readCheckout();
      if (args.task_id) {
        const id = String(args.task_id);
        try {
          const task = await board.task(scope, id);
          return JSON.stringify(taskStatus(here, checkout, task), null, 2);
        } catch (e) {
          if (e instanceof BoardError && e.status === 404) return noSuchTask(here, id);
          throw e;
        }
      }
      const tasks = await board.tasks(scope);
      const wanted = typeof args.state === "string" ? args.state : null;
      const live = tasks.filter((t) => wanted ? t.state === wanted : t.state === "In Progress" || t.state === "In Review");
      return JSON.stringify(
        boardStatus(here, checkout, live.map(projectTask), (/* @__PURE__ */ new Date()).toISOString()),
        null,
        2
      );
    }
    default:
      return `No such tool: ${name}`;
  }
}
function reply(id, result) {
  if (id === void 0) return;
  process.stdout.write(JSON.stringify({ jsonrpc: "2.0", id, result }) + "\n");
}
async function handle2(msg, resolve7 = scopeFromEnv, readCheckout = readCheckoutBinding) {
  switch (msg.method) {
    case "initialize":
      return reply(msg.id, {
        protocolVersion: MCP_PROTOCOL_VERSION,
        capabilities: { tools: {} },
        serverInfo: SERVER
      });
    /* The list resolves the board so it can say which one it will answer for
       (CC-448). It is the only place a client shows the caller anything before
       a call, and two servers publishing the same bytes are two servers a
       caller cannot tell apart. Resolving here costs no network — every
       resolver in this product is filesystem-only (D-10). */
    case "tools/list": {
      const scope = resolve7();
      return reply(msg.id, {
        tools: toolsForScope(TOOLS, "error" in scope ? scope : announced(scope))
      });
    }
    case "tools/call": {
      const params = msg.params ?? {};
      const scope = resolve7();
      if ("error" in scope) {
        return reply(msg.id, { content: [{ type: "text", text: scope.error }], isError: true });
      }
      try {
        const text = await runTool(scope, String(params.name), params.arguments ?? {}, readCheckout);
        return reply(msg.id, { content: [{ type: "text", text }] });
      } catch (e) {
        return reply(msg.id, {
          content: [{ type: "text", text: e.message }],
          isError: true
        });
      }
    }
    case "ping":
      return reply(msg.id, {});
    default:
      if (msg.id !== void 0) {
        process.stdout.write(
          JSON.stringify({
            jsonrpc: "2.0",
            id: msg.id,
            error: { code: -32601, message: `Method not found: ${msg.method}` }
          }) + "\n"
        );
      }
  }
}
function main(resolve7 = scopeFromEnv, readCheckout = readCheckoutBinding) {
  const rl = createInterface2({ input: process.stdin });
  rl.on("line", (line) => {
    const text = line.trim();
    if (!text) return;
    let msg;
    try {
      msg = JSON.parse(text);
    } catch {
      return;
    }
    void handle2(msg, resolve7, readCheckout);
  });
}
var MCP_PROTOCOL_VERSION, SERVER, announced;
var init_server = __esm({
  "../../apps/mcp/src/server.ts"() {
    "use strict";
    init_api();
    init_checkout();
    init_status();
    init_tools_list();
    init_tools_list();
    MCP_PROTOCOL_VERSION = "2024-11-05";
    SERVER = { name: "commitcycle", version: "0.1.0" };
    announced = (scope) => ({
      tenant: scope.tenant,
      repo: scope.repo,
      apiUrl: scope.apiUrl,
      origin: scopeOrigin()
    });
  }
});

// src/index.ts
import { createInterface as createInterface3 } from "node:readline/promises";
import { execFileSync as execFileSync13 } from "node:child_process";
import { existsSync as existsSync25 } from "node:fs";
import { dirname as dirname16, join as join32, resolve as resolve6 } from "node:path";

// src/branch.ts
import { readFileSync, statSync } from "node:fs";
import { isAbsolute, join } from "node:path";

// ../contracts/dist/branch.js
function taskIdFromBranch(branch) {
  if (!branch)
    return null;
  return /^(?:task|spike|fix|feat)\/([A-Z]+-\d+)(?:[-/]|$)/.exec(branch)?.[1] ?? null;
}

// src/branch.ts
function headPath(root) {
  const dotGit = join(root, ".git");
  try {
    if (statSync(dotGit).isFile()) {
      const target = readFileSync(dotGit, "utf8").trim().replace(/^gitdir:\s*/, "");
      return join(isAbsolute(target) ? target : join(root, target), "HEAD");
    }
  } catch {
  }
  return join(dotGit, "HEAD");
}
function currentBranch(root) {
  try {
    const head = readFileSync(headPath(root), "utf8").trim();
    return head.startsWith("ref:") ? head.slice(4).trim().replace(/^refs\/heads\//, "") : null;
  } catch {
    return null;
  }
}
var taskIdFrom = taskIdFromBranch;
var taskOnBranch = (root) => taskIdFrom(currentBranch(root));

// src/init.ts
import { execFileSync as execFileSync3 } from "node:child_process";
import { existsSync as existsSync4, mkdirSync as mkdirSync3, readFileSync as readFileSync9, writeFileSync as writeFileSync6 } from "node:fs";

// src/agents.ts
import { existsSync, readFileSync as readFileSync2, rmSync, writeFileSync } from "node:fs";
import { isAbsolute as isAbsolute2, join as join2 } from "node:path";

// ../../node_modules/.pnpm/zod@3.25.76/node_modules/zod/v3/external.js
var external_exports = {};
__export(external_exports, {
  BRAND: () => BRAND,
  DIRTY: () => DIRTY,
  EMPTY_PATH: () => EMPTY_PATH,
  INVALID: () => INVALID,
  NEVER: () => NEVER,
  OK: () => OK,
  ParseStatus: () => ParseStatus,
  Schema: () => ZodType,
  ZodAny: () => ZodAny,
  ZodArray: () => ZodArray,
  ZodBigInt: () => ZodBigInt,
  ZodBoolean: () => ZodBoolean,
  ZodBranded: () => ZodBranded,
  ZodCatch: () => ZodCatch,
  ZodDate: () => ZodDate,
  ZodDefault: () => ZodDefault,
  ZodDiscriminatedUnion: () => ZodDiscriminatedUnion,
  ZodEffects: () => ZodEffects,
  ZodEnum: () => ZodEnum,
  ZodError: () => ZodError,
  ZodFirstPartyTypeKind: () => ZodFirstPartyTypeKind,
  ZodFunction: () => ZodFunction,
  ZodIntersection: () => ZodIntersection,
  ZodIssueCode: () => ZodIssueCode,
  ZodLazy: () => ZodLazy,
  ZodLiteral: () => ZodLiteral,
  ZodMap: () => ZodMap,
  ZodNaN: () => ZodNaN,
  ZodNativeEnum: () => ZodNativeEnum,
  ZodNever: () => ZodNever,
  ZodNull: () => ZodNull,
  ZodNullable: () => ZodNullable,
  ZodNumber: () => ZodNumber,
  ZodObject: () => ZodObject,
  ZodOptional: () => ZodOptional,
  ZodParsedType: () => ZodParsedType,
  ZodPipeline: () => ZodPipeline,
  ZodPromise: () => ZodPromise,
  ZodReadonly: () => ZodReadonly,
  ZodRecord: () => ZodRecord,
  ZodSchema: () => ZodType,
  ZodSet: () => ZodSet,
  ZodString: () => ZodString,
  ZodSymbol: () => ZodSymbol,
  ZodTransformer: () => ZodEffects,
  ZodTuple: () => ZodTuple,
  ZodType: () => ZodType,
  ZodUndefined: () => ZodUndefined,
  ZodUnion: () => ZodUnion,
  ZodUnknown: () => ZodUnknown,
  ZodVoid: () => ZodVoid,
  addIssueToContext: () => addIssueToContext,
  any: () => anyType,
  array: () => arrayType,
  bigint: () => bigIntType,
  boolean: () => booleanType,
  coerce: () => coerce,
  custom: () => custom,
  date: () => dateType,
  datetimeRegex: () => datetimeRegex,
  defaultErrorMap: () => en_default,
  discriminatedUnion: () => discriminatedUnionType,
  effect: () => effectsType,
  enum: () => enumType,
  function: () => functionType,
  getErrorMap: () => getErrorMap,
  getParsedType: () => getParsedType,
  instanceof: () => instanceOfType,
  intersection: () => intersectionType,
  isAborted: () => isAborted,
  isAsync: () => isAsync,
  isDirty: () => isDirty,
  isValid: () => isValid,
  late: () => late,
  lazy: () => lazyType,
  literal: () => literalType,
  makeIssue: () => makeIssue,
  map: () => mapType,
  nan: () => nanType,
  nativeEnum: () => nativeEnumType,
  never: () => neverType,
  null: () => nullType,
  nullable: () => nullableType,
  number: () => numberType,
  object: () => objectType,
  objectUtil: () => objectUtil,
  oboolean: () => oboolean,
  onumber: () => onumber,
  optional: () => optionalType,
  ostring: () => ostring,
  pipeline: () => pipelineType,
  preprocess: () => preprocessType,
  promise: () => promiseType,
  quotelessJson: () => quotelessJson,
  record: () => recordType,
  set: () => setType,
  setErrorMap: () => setErrorMap,
  strictObject: () => strictObjectType,
  string: () => stringType,
  symbol: () => symbolType,
  transformer: () => effectsType,
  tuple: () => tupleType,
  undefined: () => undefinedType,
  union: () => unionType,
  unknown: () => unknownType,
  util: () => util,
  void: () => voidType
});

// ../../node_modules/.pnpm/zod@3.25.76/node_modules/zod/v3/helpers/util.js
var util;
(function(util2) {
  util2.assertEqual = (_) => {
  };
  function assertIs(_arg) {
  }
  util2.assertIs = assertIs;
  function assertNever(_x) {
    throw new Error();
  }
  util2.assertNever = assertNever;
  util2.arrayToEnum = (items) => {
    const obj = {};
    for (const item of items) {
      obj[item] = item;
    }
    return obj;
  };
  util2.getValidEnumValues = (obj) => {
    const validKeys = util2.objectKeys(obj).filter((k) => typeof obj[obj[k]] !== "number");
    const filtered = {};
    for (const k of validKeys) {
      filtered[k] = obj[k];
    }
    return util2.objectValues(filtered);
  };
  util2.objectValues = (obj) => {
    return util2.objectKeys(obj).map(function(e) {
      return obj[e];
    });
  };
  util2.objectKeys = typeof Object.keys === "function" ? (obj) => Object.keys(obj) : (object) => {
    const keys = [];
    for (const key in object) {
      if (Object.prototype.hasOwnProperty.call(object, key)) {
        keys.push(key);
      }
    }
    return keys;
  };
  util2.find = (arr, checker) => {
    for (const item of arr) {
      if (checker(item))
        return item;
    }
    return void 0;
  };
  util2.isInteger = typeof Number.isInteger === "function" ? (val) => Number.isInteger(val) : (val) => typeof val === "number" && Number.isFinite(val) && Math.floor(val) === val;
  function joinValues(array, separator = " | ") {
    return array.map((val) => typeof val === "string" ? `'${val}'` : val).join(separator);
  }
  util2.joinValues = joinValues;
  util2.jsonStringifyReplacer = (_, value) => {
    if (typeof value === "bigint") {
      return value.toString();
    }
    return value;
  };
})(util || (util = {}));
var objectUtil;
(function(objectUtil2) {
  objectUtil2.mergeShapes = (first, second) => {
    return {
      ...first,
      ...second
      // second overwrites first
    };
  };
})(objectUtil || (objectUtil = {}));
var ZodParsedType = util.arrayToEnum([
  "string",
  "nan",
  "number",
  "integer",
  "float",
  "boolean",
  "date",
  "bigint",
  "symbol",
  "function",
  "undefined",
  "null",
  "array",
  "object",
  "unknown",
  "promise",
  "void",
  "never",
  "map",
  "set"
]);
var getParsedType = (data) => {
  const t = typeof data;
  switch (t) {
    case "undefined":
      return ZodParsedType.undefined;
    case "string":
      return ZodParsedType.string;
    case "number":
      return Number.isNaN(data) ? ZodParsedType.nan : ZodParsedType.number;
    case "boolean":
      return ZodParsedType.boolean;
    case "function":
      return ZodParsedType.function;
    case "bigint":
      return ZodParsedType.bigint;
    case "symbol":
      return ZodParsedType.symbol;
    case "object":
      if (Array.isArray(data)) {
        return ZodParsedType.array;
      }
      if (data === null) {
        return ZodParsedType.null;
      }
      if (data.then && typeof data.then === "function" && data.catch && typeof data.catch === "function") {
        return ZodParsedType.promise;
      }
      if (typeof Map !== "undefined" && data instanceof Map) {
        return ZodParsedType.map;
      }
      if (typeof Set !== "undefined" && data instanceof Set) {
        return ZodParsedType.set;
      }
      if (typeof Date !== "undefined" && data instanceof Date) {
        return ZodParsedType.date;
      }
      return ZodParsedType.object;
    default:
      return ZodParsedType.unknown;
  }
};

// ../../node_modules/.pnpm/zod@3.25.76/node_modules/zod/v3/ZodError.js
var ZodIssueCode = util.arrayToEnum([
  "invalid_type",
  "invalid_literal",
  "custom",
  "invalid_union",
  "invalid_union_discriminator",
  "invalid_enum_value",
  "unrecognized_keys",
  "invalid_arguments",
  "invalid_return_type",
  "invalid_date",
  "invalid_string",
  "too_small",
  "too_big",
  "invalid_intersection_types",
  "not_multiple_of",
  "not_finite"
]);
var quotelessJson = (obj) => {
  const json = JSON.stringify(obj, null, 2);
  return json.replace(/"([^"]+)":/g, "$1:");
};
var ZodError = class _ZodError extends Error {
  get errors() {
    return this.issues;
  }
  constructor(issues) {
    super();
    this.issues = [];
    this.addIssue = (sub) => {
      this.issues = [...this.issues, sub];
    };
    this.addIssues = (subs = []) => {
      this.issues = [...this.issues, ...subs];
    };
    const actualProto = new.target.prototype;
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(this, actualProto);
    } else {
      this.__proto__ = actualProto;
    }
    this.name = "ZodError";
    this.issues = issues;
  }
  format(_mapper) {
    const mapper = _mapper || function(issue) {
      return issue.message;
    };
    const fieldErrors = { _errors: [] };
    const processError = (error) => {
      for (const issue of error.issues) {
        if (issue.code === "invalid_union") {
          issue.unionErrors.map(processError);
        } else if (issue.code === "invalid_return_type") {
          processError(issue.returnTypeError);
        } else if (issue.code === "invalid_arguments") {
          processError(issue.argumentsError);
        } else if (issue.path.length === 0) {
          fieldErrors._errors.push(mapper(issue));
        } else {
          let curr = fieldErrors;
          let i = 0;
          while (i < issue.path.length) {
            const el = issue.path[i];
            const terminal = i === issue.path.length - 1;
            if (!terminal) {
              curr[el] = curr[el] || { _errors: [] };
            } else {
              curr[el] = curr[el] || { _errors: [] };
              curr[el]._errors.push(mapper(issue));
            }
            curr = curr[el];
            i++;
          }
        }
      }
    };
    processError(this);
    return fieldErrors;
  }
  static assert(value) {
    if (!(value instanceof _ZodError)) {
      throw new Error(`Not a ZodError: ${value}`);
    }
  }
  toString() {
    return this.message;
  }
  get message() {
    return JSON.stringify(this.issues, util.jsonStringifyReplacer, 2);
  }
  get isEmpty() {
    return this.issues.length === 0;
  }
  flatten(mapper = (issue) => issue.message) {
    const fieldErrors = {};
    const formErrors = [];
    for (const sub of this.issues) {
      if (sub.path.length > 0) {
        const firstEl = sub.path[0];
        fieldErrors[firstEl] = fieldErrors[firstEl] || [];
        fieldErrors[firstEl].push(mapper(sub));
      } else {
        formErrors.push(mapper(sub));
      }
    }
    return { formErrors, fieldErrors };
  }
  get formErrors() {
    return this.flatten();
  }
};
ZodError.create = (issues) => {
  const error = new ZodError(issues);
  return error;
};

// ../../node_modules/.pnpm/zod@3.25.76/node_modules/zod/v3/locales/en.js
var errorMap = (issue, _ctx) => {
  let message;
  switch (issue.code) {
    case ZodIssueCode.invalid_type:
      if (issue.received === ZodParsedType.undefined) {
        message = "Required";
      } else {
        message = `Expected ${issue.expected}, received ${issue.received}`;
      }
      break;
    case ZodIssueCode.invalid_literal:
      message = `Invalid literal value, expected ${JSON.stringify(issue.expected, util.jsonStringifyReplacer)}`;
      break;
    case ZodIssueCode.unrecognized_keys:
      message = `Unrecognized key(s) in object: ${util.joinValues(issue.keys, ", ")}`;
      break;
    case ZodIssueCode.invalid_union:
      message = `Invalid input`;
      break;
    case ZodIssueCode.invalid_union_discriminator:
      message = `Invalid discriminator value. Expected ${util.joinValues(issue.options)}`;
      break;
    case ZodIssueCode.invalid_enum_value:
      message = `Invalid enum value. Expected ${util.joinValues(issue.options)}, received '${issue.received}'`;
      break;
    case ZodIssueCode.invalid_arguments:
      message = `Invalid function arguments`;
      break;
    case ZodIssueCode.invalid_return_type:
      message = `Invalid function return type`;
      break;
    case ZodIssueCode.invalid_date:
      message = `Invalid date`;
      break;
    case ZodIssueCode.invalid_string:
      if (typeof issue.validation === "object") {
        if ("includes" in issue.validation) {
          message = `Invalid input: must include "${issue.validation.includes}"`;
          if (typeof issue.validation.position === "number") {
            message = `${message} at one or more positions greater than or equal to ${issue.validation.position}`;
          }
        } else if ("startsWith" in issue.validation) {
          message = `Invalid input: must start with "${issue.validation.startsWith}"`;
        } else if ("endsWith" in issue.validation) {
          message = `Invalid input: must end with "${issue.validation.endsWith}"`;
        } else {
          util.assertNever(issue.validation);
        }
      } else if (issue.validation !== "regex") {
        message = `Invalid ${issue.validation}`;
      } else {
        message = "Invalid";
      }
      break;
    case ZodIssueCode.too_small:
      if (issue.type === "array")
        message = `Array must contain ${issue.exact ? "exactly" : issue.inclusive ? `at least` : `more than`} ${issue.minimum} element(s)`;
      else if (issue.type === "string")
        message = `String must contain ${issue.exact ? "exactly" : issue.inclusive ? `at least` : `over`} ${issue.minimum} character(s)`;
      else if (issue.type === "number")
        message = `Number must be ${issue.exact ? `exactly equal to ` : issue.inclusive ? `greater than or equal to ` : `greater than `}${issue.minimum}`;
      else if (issue.type === "bigint")
        message = `Number must be ${issue.exact ? `exactly equal to ` : issue.inclusive ? `greater than or equal to ` : `greater than `}${issue.minimum}`;
      else if (issue.type === "date")
        message = `Date must be ${issue.exact ? `exactly equal to ` : issue.inclusive ? `greater than or equal to ` : `greater than `}${new Date(Number(issue.minimum))}`;
      else
        message = "Invalid input";
      break;
    case ZodIssueCode.too_big:
      if (issue.type === "array")
        message = `Array must contain ${issue.exact ? `exactly` : issue.inclusive ? `at most` : `less than`} ${issue.maximum} element(s)`;
      else if (issue.type === "string")
        message = `String must contain ${issue.exact ? `exactly` : issue.inclusive ? `at most` : `under`} ${issue.maximum} character(s)`;
      else if (issue.type === "number")
        message = `Number must be ${issue.exact ? `exactly` : issue.inclusive ? `less than or equal to` : `less than`} ${issue.maximum}`;
      else if (issue.type === "bigint")
        message = `BigInt must be ${issue.exact ? `exactly` : issue.inclusive ? `less than or equal to` : `less than`} ${issue.maximum}`;
      else if (issue.type === "date")
        message = `Date must be ${issue.exact ? `exactly` : issue.inclusive ? `smaller than or equal to` : `smaller than`} ${new Date(Number(issue.maximum))}`;
      else
        message = "Invalid input";
      break;
    case ZodIssueCode.custom:
      message = `Invalid input`;
      break;
    case ZodIssueCode.invalid_intersection_types:
      message = `Intersection results could not be merged`;
      break;
    case ZodIssueCode.not_multiple_of:
      message = `Number must be a multiple of ${issue.multipleOf}`;
      break;
    case ZodIssueCode.not_finite:
      message = "Number must be finite";
      break;
    default:
      message = _ctx.defaultError;
      util.assertNever(issue);
  }
  return { message };
};
var en_default = errorMap;

// ../../node_modules/.pnpm/zod@3.25.76/node_modules/zod/v3/errors.js
var overrideErrorMap = en_default;
function setErrorMap(map) {
  overrideErrorMap = map;
}
function getErrorMap() {
  return overrideErrorMap;
}

// ../../node_modules/.pnpm/zod@3.25.76/node_modules/zod/v3/helpers/parseUtil.js
var makeIssue = (params) => {
  const { data, path, errorMaps, issueData } = params;
  const fullPath = [...path, ...issueData.path || []];
  const fullIssue = {
    ...issueData,
    path: fullPath
  };
  if (issueData.message !== void 0) {
    return {
      ...issueData,
      path: fullPath,
      message: issueData.message
    };
  }
  let errorMessage = "";
  const maps = errorMaps.filter((m) => !!m).slice().reverse();
  for (const map of maps) {
    errorMessage = map(fullIssue, { data, defaultError: errorMessage }).message;
  }
  return {
    ...issueData,
    path: fullPath,
    message: errorMessage
  };
};
var EMPTY_PATH = [];
function addIssueToContext(ctx, issueData) {
  const overrideMap = getErrorMap();
  const issue = makeIssue({
    issueData,
    data: ctx.data,
    path: ctx.path,
    errorMaps: [
      ctx.common.contextualErrorMap,
      // contextual error map is first priority
      ctx.schemaErrorMap,
      // then schema-bound map if available
      overrideMap,
      // then global override map
      overrideMap === en_default ? void 0 : en_default
      // then global default map
    ].filter((x) => !!x)
  });
  ctx.common.issues.push(issue);
}
var ParseStatus = class _ParseStatus {
  constructor() {
    this.value = "valid";
  }
  dirty() {
    if (this.value === "valid")
      this.value = "dirty";
  }
  abort() {
    if (this.value !== "aborted")
      this.value = "aborted";
  }
  static mergeArray(status, results) {
    const arrayValue = [];
    for (const s of results) {
      if (s.status === "aborted")
        return INVALID;
      if (s.status === "dirty")
        status.dirty();
      arrayValue.push(s.value);
    }
    return { status: status.value, value: arrayValue };
  }
  static async mergeObjectAsync(status, pairs) {
    const syncPairs = [];
    for (const pair of pairs) {
      const key = await pair.key;
      const value = await pair.value;
      syncPairs.push({
        key,
        value
      });
    }
    return _ParseStatus.mergeObjectSync(status, syncPairs);
  }
  static mergeObjectSync(status, pairs) {
    const finalObject = {};
    for (const pair of pairs) {
      const { key, value } = pair;
      if (key.status === "aborted")
        return INVALID;
      if (value.status === "aborted")
        return INVALID;
      if (key.status === "dirty")
        status.dirty();
      if (value.status === "dirty")
        status.dirty();
      if (key.value !== "__proto__" && (typeof value.value !== "undefined" || pair.alwaysSet)) {
        finalObject[key.value] = value.value;
      }
    }
    return { status: status.value, value: finalObject };
  }
};
var INVALID = Object.freeze({
  status: "aborted"
});
var DIRTY = (value) => ({ status: "dirty", value });
var OK = (value) => ({ status: "valid", value });
var isAborted = (x) => x.status === "aborted";
var isDirty = (x) => x.status === "dirty";
var isValid = (x) => x.status === "valid";
var isAsync = (x) => typeof Promise !== "undefined" && x instanceof Promise;

// ../../node_modules/.pnpm/zod@3.25.76/node_modules/zod/v3/helpers/errorUtil.js
var errorUtil;
(function(errorUtil2) {
  errorUtil2.errToObj = (message) => typeof message === "string" ? { message } : message || {};
  errorUtil2.toString = (message) => typeof message === "string" ? message : message?.message;
})(errorUtil || (errorUtil = {}));

// ../../node_modules/.pnpm/zod@3.25.76/node_modules/zod/v3/types.js
var ParseInputLazyPath = class {
  constructor(parent, value, path, key) {
    this._cachedPath = [];
    this.parent = parent;
    this.data = value;
    this._path = path;
    this._key = key;
  }
  get path() {
    if (!this._cachedPath.length) {
      if (Array.isArray(this._key)) {
        this._cachedPath.push(...this._path, ...this._key);
      } else {
        this._cachedPath.push(...this._path, this._key);
      }
    }
    return this._cachedPath;
  }
};
var handleResult = (ctx, result) => {
  if (isValid(result)) {
    return { success: true, data: result.value };
  } else {
    if (!ctx.common.issues.length) {
      throw new Error("Validation failed but no issues detected.");
    }
    return {
      success: false,
      get error() {
        if (this._error)
          return this._error;
        const error = new ZodError(ctx.common.issues);
        this._error = error;
        return this._error;
      }
    };
  }
};
function processCreateParams(params) {
  if (!params)
    return {};
  const { errorMap: errorMap2, invalid_type_error, required_error, description } = params;
  if (errorMap2 && (invalid_type_error || required_error)) {
    throw new Error(`Can't use "invalid_type_error" or "required_error" in conjunction with custom error map.`);
  }
  if (errorMap2)
    return { errorMap: errorMap2, description };
  const customMap = (iss, ctx) => {
    const { message } = params;
    if (iss.code === "invalid_enum_value") {
      return { message: message ?? ctx.defaultError };
    }
    if (typeof ctx.data === "undefined") {
      return { message: message ?? required_error ?? ctx.defaultError };
    }
    if (iss.code !== "invalid_type")
      return { message: ctx.defaultError };
    return { message: message ?? invalid_type_error ?? ctx.defaultError };
  };
  return { errorMap: customMap, description };
}
var ZodType = class {
  get description() {
    return this._def.description;
  }
  _getType(input) {
    return getParsedType(input.data);
  }
  _getOrReturnCtx(input, ctx) {
    return ctx || {
      common: input.parent.common,
      data: input.data,
      parsedType: getParsedType(input.data),
      schemaErrorMap: this._def.errorMap,
      path: input.path,
      parent: input.parent
    };
  }
  _processInputParams(input) {
    return {
      status: new ParseStatus(),
      ctx: {
        common: input.parent.common,
        data: input.data,
        parsedType: getParsedType(input.data),
        schemaErrorMap: this._def.errorMap,
        path: input.path,
        parent: input.parent
      }
    };
  }
  _parseSync(input) {
    const result = this._parse(input);
    if (isAsync(result)) {
      throw new Error("Synchronous parse encountered promise.");
    }
    return result;
  }
  _parseAsync(input) {
    const result = this._parse(input);
    return Promise.resolve(result);
  }
  parse(data, params) {
    const result = this.safeParse(data, params);
    if (result.success)
      return result.data;
    throw result.error;
  }
  safeParse(data, params) {
    const ctx = {
      common: {
        issues: [],
        async: params?.async ?? false,
        contextualErrorMap: params?.errorMap
      },
      path: params?.path || [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data,
      parsedType: getParsedType(data)
    };
    const result = this._parseSync({ data, path: ctx.path, parent: ctx });
    return handleResult(ctx, result);
  }
  "~validate"(data) {
    const ctx = {
      common: {
        issues: [],
        async: !!this["~standard"].async
      },
      path: [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data,
      parsedType: getParsedType(data)
    };
    if (!this["~standard"].async) {
      try {
        const result = this._parseSync({ data, path: [], parent: ctx });
        return isValid(result) ? {
          value: result.value
        } : {
          issues: ctx.common.issues
        };
      } catch (err) {
        if (err?.message?.toLowerCase()?.includes("encountered")) {
          this["~standard"].async = true;
        }
        ctx.common = {
          issues: [],
          async: true
        };
      }
    }
    return this._parseAsync({ data, path: [], parent: ctx }).then((result) => isValid(result) ? {
      value: result.value
    } : {
      issues: ctx.common.issues
    });
  }
  async parseAsync(data, params) {
    const result = await this.safeParseAsync(data, params);
    if (result.success)
      return result.data;
    throw result.error;
  }
  async safeParseAsync(data, params) {
    const ctx = {
      common: {
        issues: [],
        contextualErrorMap: params?.errorMap,
        async: true
      },
      path: params?.path || [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data,
      parsedType: getParsedType(data)
    };
    const maybeAsyncResult = this._parse({ data, path: ctx.path, parent: ctx });
    const result = await (isAsync(maybeAsyncResult) ? maybeAsyncResult : Promise.resolve(maybeAsyncResult));
    return handleResult(ctx, result);
  }
  refine(check, message) {
    const getIssueProperties = (val) => {
      if (typeof message === "string" || typeof message === "undefined") {
        return { message };
      } else if (typeof message === "function") {
        return message(val);
      } else {
        return message;
      }
    };
    return this._refinement((val, ctx) => {
      const result = check(val);
      const setError = () => ctx.addIssue({
        code: ZodIssueCode.custom,
        ...getIssueProperties(val)
      });
      if (typeof Promise !== "undefined" && result instanceof Promise) {
        return result.then((data) => {
          if (!data) {
            setError();
            return false;
          } else {
            return true;
          }
        });
      }
      if (!result) {
        setError();
        return false;
      } else {
        return true;
      }
    });
  }
  refinement(check, refinementData) {
    return this._refinement((val, ctx) => {
      if (!check(val)) {
        ctx.addIssue(typeof refinementData === "function" ? refinementData(val, ctx) : refinementData);
        return false;
      } else {
        return true;
      }
    });
  }
  _refinement(refinement) {
    return new ZodEffects({
      schema: this,
      typeName: ZodFirstPartyTypeKind.ZodEffects,
      effect: { type: "refinement", refinement }
    });
  }
  superRefine(refinement) {
    return this._refinement(refinement);
  }
  constructor(def) {
    this.spa = this.safeParseAsync;
    this._def = def;
    this.parse = this.parse.bind(this);
    this.safeParse = this.safeParse.bind(this);
    this.parseAsync = this.parseAsync.bind(this);
    this.safeParseAsync = this.safeParseAsync.bind(this);
    this.spa = this.spa.bind(this);
    this.refine = this.refine.bind(this);
    this.refinement = this.refinement.bind(this);
    this.superRefine = this.superRefine.bind(this);
    this.optional = this.optional.bind(this);
    this.nullable = this.nullable.bind(this);
    this.nullish = this.nullish.bind(this);
    this.array = this.array.bind(this);
    this.promise = this.promise.bind(this);
    this.or = this.or.bind(this);
    this.and = this.and.bind(this);
    this.transform = this.transform.bind(this);
    this.brand = this.brand.bind(this);
    this.default = this.default.bind(this);
    this.catch = this.catch.bind(this);
    this.describe = this.describe.bind(this);
    this.pipe = this.pipe.bind(this);
    this.readonly = this.readonly.bind(this);
    this.isNullable = this.isNullable.bind(this);
    this.isOptional = this.isOptional.bind(this);
    this["~standard"] = {
      version: 1,
      vendor: "zod",
      validate: (data) => this["~validate"](data)
    };
  }
  optional() {
    return ZodOptional.create(this, this._def);
  }
  nullable() {
    return ZodNullable.create(this, this._def);
  }
  nullish() {
    return this.nullable().optional();
  }
  array() {
    return ZodArray.create(this);
  }
  promise() {
    return ZodPromise.create(this, this._def);
  }
  or(option) {
    return ZodUnion.create([this, option], this._def);
  }
  and(incoming) {
    return ZodIntersection.create(this, incoming, this._def);
  }
  transform(transform) {
    return new ZodEffects({
      ...processCreateParams(this._def),
      schema: this,
      typeName: ZodFirstPartyTypeKind.ZodEffects,
      effect: { type: "transform", transform }
    });
  }
  default(def) {
    const defaultValueFunc = typeof def === "function" ? def : () => def;
    return new ZodDefault({
      ...processCreateParams(this._def),
      innerType: this,
      defaultValue: defaultValueFunc,
      typeName: ZodFirstPartyTypeKind.ZodDefault
    });
  }
  brand() {
    return new ZodBranded({
      typeName: ZodFirstPartyTypeKind.ZodBranded,
      type: this,
      ...processCreateParams(this._def)
    });
  }
  catch(def) {
    const catchValueFunc = typeof def === "function" ? def : () => def;
    return new ZodCatch({
      ...processCreateParams(this._def),
      innerType: this,
      catchValue: catchValueFunc,
      typeName: ZodFirstPartyTypeKind.ZodCatch
    });
  }
  describe(description) {
    const This = this.constructor;
    return new This({
      ...this._def,
      description
    });
  }
  pipe(target) {
    return ZodPipeline.create(this, target);
  }
  readonly() {
    return ZodReadonly.create(this);
  }
  isOptional() {
    return this.safeParse(void 0).success;
  }
  isNullable() {
    return this.safeParse(null).success;
  }
};
var cuidRegex = /^c[^\s-]{8,}$/i;
var cuid2Regex = /^[0-9a-z]+$/;
var ulidRegex = /^[0-9A-HJKMNP-TV-Z]{26}$/i;
var uuidRegex = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/i;
var nanoidRegex = /^[a-z0-9_-]{21}$/i;
var jwtRegex = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/;
var durationRegex = /^[-+]?P(?!$)(?:(?:[-+]?\d+Y)|(?:[-+]?\d+[.,]\d+Y$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:(?:[-+]?\d+W)|(?:[-+]?\d+[.,]\d+W$))?(?:(?:[-+]?\d+D)|(?:[-+]?\d+[.,]\d+D$))?(?:T(?=[\d+-])(?:(?:[-+]?\d+H)|(?:[-+]?\d+[.,]\d+H$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:[-+]?\d+(?:[.,]\d+)?S)?)??$/;
var emailRegex = /^(?!\.)(?!.*\.\.)([A-Z0-9_'+\-\.]*)[A-Z0-9_+-]@([A-Z0-9][A-Z0-9\-]*\.)+[A-Z]{2,}$/i;
var _emojiRegex = `^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$`;
var emojiRegex;
var ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/;
var ipv4CidrRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/(3[0-2]|[12]?[0-9])$/;
var ipv6Regex = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/;
var ipv6CidrRegex = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/;
var base64Regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
var base64urlRegex = /^([0-9a-zA-Z-_]{4})*(([0-9a-zA-Z-_]{2}(==)?)|([0-9a-zA-Z-_]{3}(=)?))?$/;
var dateRegexSource = `((\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-((0[13578]|1[02])-(0[1-9]|[12]\\d|3[01])|(0[469]|11)-(0[1-9]|[12]\\d|30)|(02)-(0[1-9]|1\\d|2[0-8])))`;
var dateRegex = new RegExp(`^${dateRegexSource}$`);
function timeRegexSource(args) {
  let secondsRegexSource = `[0-5]\\d`;
  if (args.precision) {
    secondsRegexSource = `${secondsRegexSource}\\.\\d{${args.precision}}`;
  } else if (args.precision == null) {
    secondsRegexSource = `${secondsRegexSource}(\\.\\d+)?`;
  }
  const secondsQuantifier = args.precision ? "+" : "?";
  return `([01]\\d|2[0-3]):[0-5]\\d(:${secondsRegexSource})${secondsQuantifier}`;
}
function timeRegex(args) {
  return new RegExp(`^${timeRegexSource(args)}$`);
}
function datetimeRegex(args) {
  let regex = `${dateRegexSource}T${timeRegexSource(args)}`;
  const opts = [];
  opts.push(args.local ? `Z?` : `Z`);
  if (args.offset)
    opts.push(`([+-]\\d{2}:?\\d{2})`);
  regex = `${regex}(${opts.join("|")})`;
  return new RegExp(`^${regex}$`);
}
function isValidIP(ip, version) {
  if ((version === "v4" || !version) && ipv4Regex.test(ip)) {
    return true;
  }
  if ((version === "v6" || !version) && ipv6Regex.test(ip)) {
    return true;
  }
  return false;
}
function isValidJWT(jwt, alg) {
  if (!jwtRegex.test(jwt))
    return false;
  try {
    const [header] = jwt.split(".");
    if (!header)
      return false;
    const base64 = header.replace(/-/g, "+").replace(/_/g, "/").padEnd(header.length + (4 - header.length % 4) % 4, "=");
    const decoded = JSON.parse(atob(base64));
    if (typeof decoded !== "object" || decoded === null)
      return false;
    if ("typ" in decoded && decoded?.typ !== "JWT")
      return false;
    if (!decoded.alg)
      return false;
    if (alg && decoded.alg !== alg)
      return false;
    return true;
  } catch {
    return false;
  }
}
function isValidCidr(ip, version) {
  if ((version === "v4" || !version) && ipv4CidrRegex.test(ip)) {
    return true;
  }
  if ((version === "v6" || !version) && ipv6CidrRegex.test(ip)) {
    return true;
  }
  return false;
}
var ZodString = class _ZodString extends ZodType {
  _parse(input) {
    if (this._def.coerce) {
      input.data = String(input.data);
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.string) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.string,
        received: ctx2.parsedType
      });
      return INVALID;
    }
    const status = new ParseStatus();
    let ctx = void 0;
    for (const check of this._def.checks) {
      if (check.kind === "min") {
        if (input.data.length < check.value) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_small,
            minimum: check.value,
            type: "string",
            inclusive: true,
            exact: false,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "max") {
        if (input.data.length > check.value) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_big,
            maximum: check.value,
            type: "string",
            inclusive: true,
            exact: false,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "length") {
        const tooBig = input.data.length > check.value;
        const tooSmall = input.data.length < check.value;
        if (tooBig || tooSmall) {
          ctx = this._getOrReturnCtx(input, ctx);
          if (tooBig) {
            addIssueToContext(ctx, {
              code: ZodIssueCode.too_big,
              maximum: check.value,
              type: "string",
              inclusive: true,
              exact: true,
              message: check.message
            });
          } else if (tooSmall) {
            addIssueToContext(ctx, {
              code: ZodIssueCode.too_small,
              minimum: check.value,
              type: "string",
              inclusive: true,
              exact: true,
              message: check.message
            });
          }
          status.dirty();
        }
      } else if (check.kind === "email") {
        if (!emailRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "email",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "emoji") {
        if (!emojiRegex) {
          emojiRegex = new RegExp(_emojiRegex, "u");
        }
        if (!emojiRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "emoji",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "uuid") {
        if (!uuidRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "uuid",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "nanoid") {
        if (!nanoidRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "nanoid",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "cuid") {
        if (!cuidRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "cuid",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "cuid2") {
        if (!cuid2Regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "cuid2",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "ulid") {
        if (!ulidRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "ulid",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "url") {
        try {
          new URL(input.data);
        } catch {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "url",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "regex") {
        check.regex.lastIndex = 0;
        const testResult = check.regex.test(input.data);
        if (!testResult) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "regex",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "trim") {
        input.data = input.data.trim();
      } else if (check.kind === "includes") {
        if (!input.data.includes(check.value, check.position)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: { includes: check.value, position: check.position },
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "toLowerCase") {
        input.data = input.data.toLowerCase();
      } else if (check.kind === "toUpperCase") {
        input.data = input.data.toUpperCase();
      } else if (check.kind === "startsWith") {
        if (!input.data.startsWith(check.value)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: { startsWith: check.value },
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "endsWith") {
        if (!input.data.endsWith(check.value)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: { endsWith: check.value },
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "datetime") {
        const regex = datetimeRegex(check);
        if (!regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: "datetime",
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "date") {
        const regex = dateRegex;
        if (!regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: "date",
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "time") {
        const regex = timeRegex(check);
        if (!regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: "time",
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "duration") {
        if (!durationRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "duration",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "ip") {
        if (!isValidIP(input.data, check.version)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "ip",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "jwt") {
        if (!isValidJWT(input.data, check.alg)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "jwt",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "cidr") {
        if (!isValidCidr(input.data, check.version)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "cidr",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "base64") {
        if (!base64Regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "base64",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "base64url") {
        if (!base64urlRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "base64url",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else {
        util.assertNever(check);
      }
    }
    return { status: status.value, value: input.data };
  }
  _regex(regex, validation, message) {
    return this.refinement((data) => regex.test(data), {
      validation,
      code: ZodIssueCode.invalid_string,
      ...errorUtil.errToObj(message)
    });
  }
  _addCheck(check) {
    return new _ZodString({
      ...this._def,
      checks: [...this._def.checks, check]
    });
  }
  email(message) {
    return this._addCheck({ kind: "email", ...errorUtil.errToObj(message) });
  }
  url(message) {
    return this._addCheck({ kind: "url", ...errorUtil.errToObj(message) });
  }
  emoji(message) {
    return this._addCheck({ kind: "emoji", ...errorUtil.errToObj(message) });
  }
  uuid(message) {
    return this._addCheck({ kind: "uuid", ...errorUtil.errToObj(message) });
  }
  nanoid(message) {
    return this._addCheck({ kind: "nanoid", ...errorUtil.errToObj(message) });
  }
  cuid(message) {
    return this._addCheck({ kind: "cuid", ...errorUtil.errToObj(message) });
  }
  cuid2(message) {
    return this._addCheck({ kind: "cuid2", ...errorUtil.errToObj(message) });
  }
  ulid(message) {
    return this._addCheck({ kind: "ulid", ...errorUtil.errToObj(message) });
  }
  base64(message) {
    return this._addCheck({ kind: "base64", ...errorUtil.errToObj(message) });
  }
  base64url(message) {
    return this._addCheck({
      kind: "base64url",
      ...errorUtil.errToObj(message)
    });
  }
  jwt(options) {
    return this._addCheck({ kind: "jwt", ...errorUtil.errToObj(options) });
  }
  ip(options) {
    return this._addCheck({ kind: "ip", ...errorUtil.errToObj(options) });
  }
  cidr(options) {
    return this._addCheck({ kind: "cidr", ...errorUtil.errToObj(options) });
  }
  datetime(options) {
    if (typeof options === "string") {
      return this._addCheck({
        kind: "datetime",
        precision: null,
        offset: false,
        local: false,
        message: options
      });
    }
    return this._addCheck({
      kind: "datetime",
      precision: typeof options?.precision === "undefined" ? null : options?.precision,
      offset: options?.offset ?? false,
      local: options?.local ?? false,
      ...errorUtil.errToObj(options?.message)
    });
  }
  date(message) {
    return this._addCheck({ kind: "date", message });
  }
  time(options) {
    if (typeof options === "string") {
      return this._addCheck({
        kind: "time",
        precision: null,
        message: options
      });
    }
    return this._addCheck({
      kind: "time",
      precision: typeof options?.precision === "undefined" ? null : options?.precision,
      ...errorUtil.errToObj(options?.message)
    });
  }
  duration(message) {
    return this._addCheck({ kind: "duration", ...errorUtil.errToObj(message) });
  }
  regex(regex, message) {
    return this._addCheck({
      kind: "regex",
      regex,
      ...errorUtil.errToObj(message)
    });
  }
  includes(value, options) {
    return this._addCheck({
      kind: "includes",
      value,
      position: options?.position,
      ...errorUtil.errToObj(options?.message)
    });
  }
  startsWith(value, message) {
    return this._addCheck({
      kind: "startsWith",
      value,
      ...errorUtil.errToObj(message)
    });
  }
  endsWith(value, message) {
    return this._addCheck({
      kind: "endsWith",
      value,
      ...errorUtil.errToObj(message)
    });
  }
  min(minLength, message) {
    return this._addCheck({
      kind: "min",
      value: minLength,
      ...errorUtil.errToObj(message)
    });
  }
  max(maxLength, message) {
    return this._addCheck({
      kind: "max",
      value: maxLength,
      ...errorUtil.errToObj(message)
    });
  }
  length(len, message) {
    return this._addCheck({
      kind: "length",
      value: len,
      ...errorUtil.errToObj(message)
    });
  }
  /**
   * Equivalent to `.min(1)`
   */
  nonempty(message) {
    return this.min(1, errorUtil.errToObj(message));
  }
  trim() {
    return new _ZodString({
      ...this._def,
      checks: [...this._def.checks, { kind: "trim" }]
    });
  }
  toLowerCase() {
    return new _ZodString({
      ...this._def,
      checks: [...this._def.checks, { kind: "toLowerCase" }]
    });
  }
  toUpperCase() {
    return new _ZodString({
      ...this._def,
      checks: [...this._def.checks, { kind: "toUpperCase" }]
    });
  }
  get isDatetime() {
    return !!this._def.checks.find((ch) => ch.kind === "datetime");
  }
  get isDate() {
    return !!this._def.checks.find((ch) => ch.kind === "date");
  }
  get isTime() {
    return !!this._def.checks.find((ch) => ch.kind === "time");
  }
  get isDuration() {
    return !!this._def.checks.find((ch) => ch.kind === "duration");
  }
  get isEmail() {
    return !!this._def.checks.find((ch) => ch.kind === "email");
  }
  get isURL() {
    return !!this._def.checks.find((ch) => ch.kind === "url");
  }
  get isEmoji() {
    return !!this._def.checks.find((ch) => ch.kind === "emoji");
  }
  get isUUID() {
    return !!this._def.checks.find((ch) => ch.kind === "uuid");
  }
  get isNANOID() {
    return !!this._def.checks.find((ch) => ch.kind === "nanoid");
  }
  get isCUID() {
    return !!this._def.checks.find((ch) => ch.kind === "cuid");
  }
  get isCUID2() {
    return !!this._def.checks.find((ch) => ch.kind === "cuid2");
  }
  get isULID() {
    return !!this._def.checks.find((ch) => ch.kind === "ulid");
  }
  get isIP() {
    return !!this._def.checks.find((ch) => ch.kind === "ip");
  }
  get isCIDR() {
    return !!this._def.checks.find((ch) => ch.kind === "cidr");
  }
  get isBase64() {
    return !!this._def.checks.find((ch) => ch.kind === "base64");
  }
  get isBase64url() {
    return !!this._def.checks.find((ch) => ch.kind === "base64url");
  }
  get minLength() {
    let min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "min") {
        if (min === null || ch.value > min)
          min = ch.value;
      }
    }
    return min;
  }
  get maxLength() {
    let max = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "max") {
        if (max === null || ch.value < max)
          max = ch.value;
      }
    }
    return max;
  }
};
ZodString.create = (params) => {
  return new ZodString({
    checks: [],
    typeName: ZodFirstPartyTypeKind.ZodString,
    coerce: params?.coerce ?? false,
    ...processCreateParams(params)
  });
};
function floatSafeRemainder(val, step) {
  const valDecCount = (val.toString().split(".")[1] || "").length;
  const stepDecCount = (step.toString().split(".")[1] || "").length;
  const decCount = valDecCount > stepDecCount ? valDecCount : stepDecCount;
  const valInt = Number.parseInt(val.toFixed(decCount).replace(".", ""));
  const stepInt = Number.parseInt(step.toFixed(decCount).replace(".", ""));
  return valInt % stepInt / 10 ** decCount;
}
var ZodNumber = class _ZodNumber extends ZodType {
  constructor() {
    super(...arguments);
    this.min = this.gte;
    this.max = this.lte;
    this.step = this.multipleOf;
  }
  _parse(input) {
    if (this._def.coerce) {
      input.data = Number(input.data);
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.number) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.number,
        received: ctx2.parsedType
      });
      return INVALID;
    }
    let ctx = void 0;
    const status = new ParseStatus();
    for (const check of this._def.checks) {
      if (check.kind === "int") {
        if (!util.isInteger(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_type,
            expected: "integer",
            received: "float",
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "min") {
        const tooSmall = check.inclusive ? input.data < check.value : input.data <= check.value;
        if (tooSmall) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_small,
            minimum: check.value,
            type: "number",
            inclusive: check.inclusive,
            exact: false,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "max") {
        const tooBig = check.inclusive ? input.data > check.value : input.data >= check.value;
        if (tooBig) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_big,
            maximum: check.value,
            type: "number",
            inclusive: check.inclusive,
            exact: false,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "multipleOf") {
        if (floatSafeRemainder(input.data, check.value) !== 0) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.not_multiple_of,
            multipleOf: check.value,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "finite") {
        if (!Number.isFinite(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.not_finite,
            message: check.message
          });
          status.dirty();
        }
      } else {
        util.assertNever(check);
      }
    }
    return { status: status.value, value: input.data };
  }
  gte(value, message) {
    return this.setLimit("min", value, true, errorUtil.toString(message));
  }
  gt(value, message) {
    return this.setLimit("min", value, false, errorUtil.toString(message));
  }
  lte(value, message) {
    return this.setLimit("max", value, true, errorUtil.toString(message));
  }
  lt(value, message) {
    return this.setLimit("max", value, false, errorUtil.toString(message));
  }
  setLimit(kind, value, inclusive, message) {
    return new _ZodNumber({
      ...this._def,
      checks: [
        ...this._def.checks,
        {
          kind,
          value,
          inclusive,
          message: errorUtil.toString(message)
        }
      ]
    });
  }
  _addCheck(check) {
    return new _ZodNumber({
      ...this._def,
      checks: [...this._def.checks, check]
    });
  }
  int(message) {
    return this._addCheck({
      kind: "int",
      message: errorUtil.toString(message)
    });
  }
  positive(message) {
    return this._addCheck({
      kind: "min",
      value: 0,
      inclusive: false,
      message: errorUtil.toString(message)
    });
  }
  negative(message) {
    return this._addCheck({
      kind: "max",
      value: 0,
      inclusive: false,
      message: errorUtil.toString(message)
    });
  }
  nonpositive(message) {
    return this._addCheck({
      kind: "max",
      value: 0,
      inclusive: true,
      message: errorUtil.toString(message)
    });
  }
  nonnegative(message) {
    return this._addCheck({
      kind: "min",
      value: 0,
      inclusive: true,
      message: errorUtil.toString(message)
    });
  }
  multipleOf(value, message) {
    return this._addCheck({
      kind: "multipleOf",
      value,
      message: errorUtil.toString(message)
    });
  }
  finite(message) {
    return this._addCheck({
      kind: "finite",
      message: errorUtil.toString(message)
    });
  }
  safe(message) {
    return this._addCheck({
      kind: "min",
      inclusive: true,
      value: Number.MIN_SAFE_INTEGER,
      message: errorUtil.toString(message)
    })._addCheck({
      kind: "max",
      inclusive: true,
      value: Number.MAX_SAFE_INTEGER,
      message: errorUtil.toString(message)
    });
  }
  get minValue() {
    let min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "min") {
        if (min === null || ch.value > min)
          min = ch.value;
      }
    }
    return min;
  }
  get maxValue() {
    let max = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "max") {
        if (max === null || ch.value < max)
          max = ch.value;
      }
    }
    return max;
  }
  get isInt() {
    return !!this._def.checks.find((ch) => ch.kind === "int" || ch.kind === "multipleOf" && util.isInteger(ch.value));
  }
  get isFinite() {
    let max = null;
    let min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "finite" || ch.kind === "int" || ch.kind === "multipleOf") {
        return true;
      } else if (ch.kind === "min") {
        if (min === null || ch.value > min)
          min = ch.value;
      } else if (ch.kind === "max") {
        if (max === null || ch.value < max)
          max = ch.value;
      }
    }
    return Number.isFinite(min) && Number.isFinite(max);
  }
};
ZodNumber.create = (params) => {
  return new ZodNumber({
    checks: [],
    typeName: ZodFirstPartyTypeKind.ZodNumber,
    coerce: params?.coerce || false,
    ...processCreateParams(params)
  });
};
var ZodBigInt = class _ZodBigInt extends ZodType {
  constructor() {
    super(...arguments);
    this.min = this.gte;
    this.max = this.lte;
  }
  _parse(input) {
    if (this._def.coerce) {
      try {
        input.data = BigInt(input.data);
      } catch {
        return this._getInvalidInput(input);
      }
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.bigint) {
      return this._getInvalidInput(input);
    }
    let ctx = void 0;
    const status = new ParseStatus();
    for (const check of this._def.checks) {
      if (check.kind === "min") {
        const tooSmall = check.inclusive ? input.data < check.value : input.data <= check.value;
        if (tooSmall) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_small,
            type: "bigint",
            minimum: check.value,
            inclusive: check.inclusive,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "max") {
        const tooBig = check.inclusive ? input.data > check.value : input.data >= check.value;
        if (tooBig) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_big,
            type: "bigint",
            maximum: check.value,
            inclusive: check.inclusive,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "multipleOf") {
        if (input.data % check.value !== BigInt(0)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.not_multiple_of,
            multipleOf: check.value,
            message: check.message
          });
          status.dirty();
        }
      } else {
        util.assertNever(check);
      }
    }
    return { status: status.value, value: input.data };
  }
  _getInvalidInput(input) {
    const ctx = this._getOrReturnCtx(input);
    addIssueToContext(ctx, {
      code: ZodIssueCode.invalid_type,
      expected: ZodParsedType.bigint,
      received: ctx.parsedType
    });
    return INVALID;
  }
  gte(value, message) {
    return this.setLimit("min", value, true, errorUtil.toString(message));
  }
  gt(value, message) {
    return this.setLimit("min", value, false, errorUtil.toString(message));
  }
  lte(value, message) {
    return this.setLimit("max", value, true, errorUtil.toString(message));
  }
  lt(value, message) {
    return this.setLimit("max", value, false, errorUtil.toString(message));
  }
  setLimit(kind, value, inclusive, message) {
    return new _ZodBigInt({
      ...this._def,
      checks: [
        ...this._def.checks,
        {
          kind,
          value,
          inclusive,
          message: errorUtil.toString(message)
        }
      ]
    });
  }
  _addCheck(check) {
    return new _ZodBigInt({
      ...this._def,
      checks: [...this._def.checks, check]
    });
  }
  positive(message) {
    return this._addCheck({
      kind: "min",
      value: BigInt(0),
      inclusive: false,
      message: errorUtil.toString(message)
    });
  }
  negative(message) {
    return this._addCheck({
      kind: "max",
      value: BigInt(0),
      inclusive: false,
      message: errorUtil.toString(message)
    });
  }
  nonpositive(message) {
    return this._addCheck({
      kind: "max",
      value: BigInt(0),
      inclusive: true,
      message: errorUtil.toString(message)
    });
  }
  nonnegative(message) {
    return this._addCheck({
      kind: "min",
      value: BigInt(0),
      inclusive: true,
      message: errorUtil.toString(message)
    });
  }
  multipleOf(value, message) {
    return this._addCheck({
      kind: "multipleOf",
      value,
      message: errorUtil.toString(message)
    });
  }
  get minValue() {
    let min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "min") {
        if (min === null || ch.value > min)
          min = ch.value;
      }
    }
    return min;
  }
  get maxValue() {
    let max = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "max") {
        if (max === null || ch.value < max)
          max = ch.value;
      }
    }
    return max;
  }
};
ZodBigInt.create = (params) => {
  return new ZodBigInt({
    checks: [],
    typeName: ZodFirstPartyTypeKind.ZodBigInt,
    coerce: params?.coerce ?? false,
    ...processCreateParams(params)
  });
};
var ZodBoolean = class extends ZodType {
  _parse(input) {
    if (this._def.coerce) {
      input.data = Boolean(input.data);
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.boolean) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.boolean,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input.data);
  }
};
ZodBoolean.create = (params) => {
  return new ZodBoolean({
    typeName: ZodFirstPartyTypeKind.ZodBoolean,
    coerce: params?.coerce || false,
    ...processCreateParams(params)
  });
};
var ZodDate = class _ZodDate extends ZodType {
  _parse(input) {
    if (this._def.coerce) {
      input.data = new Date(input.data);
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.date) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.date,
        received: ctx2.parsedType
      });
      return INVALID;
    }
    if (Number.isNaN(input.data.getTime())) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_date
      });
      return INVALID;
    }
    const status = new ParseStatus();
    let ctx = void 0;
    for (const check of this._def.checks) {
      if (check.kind === "min") {
        if (input.data.getTime() < check.value) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_small,
            message: check.message,
            inclusive: true,
            exact: false,
            minimum: check.value,
            type: "date"
          });
          status.dirty();
        }
      } else if (check.kind === "max") {
        if (input.data.getTime() > check.value) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_big,
            message: check.message,
            inclusive: true,
            exact: false,
            maximum: check.value,
            type: "date"
          });
          status.dirty();
        }
      } else {
        util.assertNever(check);
      }
    }
    return {
      status: status.value,
      value: new Date(input.data.getTime())
    };
  }
  _addCheck(check) {
    return new _ZodDate({
      ...this._def,
      checks: [...this._def.checks, check]
    });
  }
  min(minDate, message) {
    return this._addCheck({
      kind: "min",
      value: minDate.getTime(),
      message: errorUtil.toString(message)
    });
  }
  max(maxDate, message) {
    return this._addCheck({
      kind: "max",
      value: maxDate.getTime(),
      message: errorUtil.toString(message)
    });
  }
  get minDate() {
    let min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "min") {
        if (min === null || ch.value > min)
          min = ch.value;
      }
    }
    return min != null ? new Date(min) : null;
  }
  get maxDate() {
    let max = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "max") {
        if (max === null || ch.value < max)
          max = ch.value;
      }
    }
    return max != null ? new Date(max) : null;
  }
};
ZodDate.create = (params) => {
  return new ZodDate({
    checks: [],
    coerce: params?.coerce || false,
    typeName: ZodFirstPartyTypeKind.ZodDate,
    ...processCreateParams(params)
  });
};
var ZodSymbol = class extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.symbol) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.symbol,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input.data);
  }
};
ZodSymbol.create = (params) => {
  return new ZodSymbol({
    typeName: ZodFirstPartyTypeKind.ZodSymbol,
    ...processCreateParams(params)
  });
};
var ZodUndefined = class extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.undefined) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.undefined,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input.data);
  }
};
ZodUndefined.create = (params) => {
  return new ZodUndefined({
    typeName: ZodFirstPartyTypeKind.ZodUndefined,
    ...processCreateParams(params)
  });
};
var ZodNull = class extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.null) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.null,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input.data);
  }
};
ZodNull.create = (params) => {
  return new ZodNull({
    typeName: ZodFirstPartyTypeKind.ZodNull,
    ...processCreateParams(params)
  });
};
var ZodAny = class extends ZodType {
  constructor() {
    super(...arguments);
    this._any = true;
  }
  _parse(input) {
    return OK(input.data);
  }
};
ZodAny.create = (params) => {
  return new ZodAny({
    typeName: ZodFirstPartyTypeKind.ZodAny,
    ...processCreateParams(params)
  });
};
var ZodUnknown = class extends ZodType {
  constructor() {
    super(...arguments);
    this._unknown = true;
  }
  _parse(input) {
    return OK(input.data);
  }
};
ZodUnknown.create = (params) => {
  return new ZodUnknown({
    typeName: ZodFirstPartyTypeKind.ZodUnknown,
    ...processCreateParams(params)
  });
};
var ZodNever = class extends ZodType {
  _parse(input) {
    const ctx = this._getOrReturnCtx(input);
    addIssueToContext(ctx, {
      code: ZodIssueCode.invalid_type,
      expected: ZodParsedType.never,
      received: ctx.parsedType
    });
    return INVALID;
  }
};
ZodNever.create = (params) => {
  return new ZodNever({
    typeName: ZodFirstPartyTypeKind.ZodNever,
    ...processCreateParams(params)
  });
};
var ZodVoid = class extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.undefined) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.void,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input.data);
  }
};
ZodVoid.create = (params) => {
  return new ZodVoid({
    typeName: ZodFirstPartyTypeKind.ZodVoid,
    ...processCreateParams(params)
  });
};
var ZodArray = class _ZodArray extends ZodType {
  _parse(input) {
    const { ctx, status } = this._processInputParams(input);
    const def = this._def;
    if (ctx.parsedType !== ZodParsedType.array) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.array,
        received: ctx.parsedType
      });
      return INVALID;
    }
    if (def.exactLength !== null) {
      const tooBig = ctx.data.length > def.exactLength.value;
      const tooSmall = ctx.data.length < def.exactLength.value;
      if (tooBig || tooSmall) {
        addIssueToContext(ctx, {
          code: tooBig ? ZodIssueCode.too_big : ZodIssueCode.too_small,
          minimum: tooSmall ? def.exactLength.value : void 0,
          maximum: tooBig ? def.exactLength.value : void 0,
          type: "array",
          inclusive: true,
          exact: true,
          message: def.exactLength.message
        });
        status.dirty();
      }
    }
    if (def.minLength !== null) {
      if (ctx.data.length < def.minLength.value) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.too_small,
          minimum: def.minLength.value,
          type: "array",
          inclusive: true,
          exact: false,
          message: def.minLength.message
        });
        status.dirty();
      }
    }
    if (def.maxLength !== null) {
      if (ctx.data.length > def.maxLength.value) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.too_big,
          maximum: def.maxLength.value,
          type: "array",
          inclusive: true,
          exact: false,
          message: def.maxLength.message
        });
        status.dirty();
      }
    }
    if (ctx.common.async) {
      return Promise.all([...ctx.data].map((item, i) => {
        return def.type._parseAsync(new ParseInputLazyPath(ctx, item, ctx.path, i));
      })).then((result2) => {
        return ParseStatus.mergeArray(status, result2);
      });
    }
    const result = [...ctx.data].map((item, i) => {
      return def.type._parseSync(new ParseInputLazyPath(ctx, item, ctx.path, i));
    });
    return ParseStatus.mergeArray(status, result);
  }
  get element() {
    return this._def.type;
  }
  min(minLength, message) {
    return new _ZodArray({
      ...this._def,
      minLength: { value: minLength, message: errorUtil.toString(message) }
    });
  }
  max(maxLength, message) {
    return new _ZodArray({
      ...this._def,
      maxLength: { value: maxLength, message: errorUtil.toString(message) }
    });
  }
  length(len, message) {
    return new _ZodArray({
      ...this._def,
      exactLength: { value: len, message: errorUtil.toString(message) }
    });
  }
  nonempty(message) {
    return this.min(1, message);
  }
};
ZodArray.create = (schema, params) => {
  return new ZodArray({
    type: schema,
    minLength: null,
    maxLength: null,
    exactLength: null,
    typeName: ZodFirstPartyTypeKind.ZodArray,
    ...processCreateParams(params)
  });
};
function deepPartialify(schema) {
  if (schema instanceof ZodObject) {
    const newShape = {};
    for (const key in schema.shape) {
      const fieldSchema = schema.shape[key];
      newShape[key] = ZodOptional.create(deepPartialify(fieldSchema));
    }
    return new ZodObject({
      ...schema._def,
      shape: () => newShape
    });
  } else if (schema instanceof ZodArray) {
    return new ZodArray({
      ...schema._def,
      type: deepPartialify(schema.element)
    });
  } else if (schema instanceof ZodOptional) {
    return ZodOptional.create(deepPartialify(schema.unwrap()));
  } else if (schema instanceof ZodNullable) {
    return ZodNullable.create(deepPartialify(schema.unwrap()));
  } else if (schema instanceof ZodTuple) {
    return ZodTuple.create(schema.items.map((item) => deepPartialify(item)));
  } else {
    return schema;
  }
}
var ZodObject = class _ZodObject extends ZodType {
  constructor() {
    super(...arguments);
    this._cached = null;
    this.nonstrict = this.passthrough;
    this.augment = this.extend;
  }
  _getCached() {
    if (this._cached !== null)
      return this._cached;
    const shape = this._def.shape();
    const keys = util.objectKeys(shape);
    this._cached = { shape, keys };
    return this._cached;
  }
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.object) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.object,
        received: ctx2.parsedType
      });
      return INVALID;
    }
    const { status, ctx } = this._processInputParams(input);
    const { shape, keys: shapeKeys } = this._getCached();
    const extraKeys = [];
    if (!(this._def.catchall instanceof ZodNever && this._def.unknownKeys === "strip")) {
      for (const key in ctx.data) {
        if (!shapeKeys.includes(key)) {
          extraKeys.push(key);
        }
      }
    }
    const pairs = [];
    for (const key of shapeKeys) {
      const keyValidator = shape[key];
      const value = ctx.data[key];
      pairs.push({
        key: { status: "valid", value: key },
        value: keyValidator._parse(new ParseInputLazyPath(ctx, value, ctx.path, key)),
        alwaysSet: key in ctx.data
      });
    }
    if (this._def.catchall instanceof ZodNever) {
      const unknownKeys = this._def.unknownKeys;
      if (unknownKeys === "passthrough") {
        for (const key of extraKeys) {
          pairs.push({
            key: { status: "valid", value: key },
            value: { status: "valid", value: ctx.data[key] }
          });
        }
      } else if (unknownKeys === "strict") {
        if (extraKeys.length > 0) {
          addIssueToContext(ctx, {
            code: ZodIssueCode.unrecognized_keys,
            keys: extraKeys
          });
          status.dirty();
        }
      } else if (unknownKeys === "strip") {
      } else {
        throw new Error(`Internal ZodObject error: invalid unknownKeys value.`);
      }
    } else {
      const catchall = this._def.catchall;
      for (const key of extraKeys) {
        const value = ctx.data[key];
        pairs.push({
          key: { status: "valid", value: key },
          value: catchall._parse(
            new ParseInputLazyPath(ctx, value, ctx.path, key)
            //, ctx.child(key), value, getParsedType(value)
          ),
          alwaysSet: key in ctx.data
        });
      }
    }
    if (ctx.common.async) {
      return Promise.resolve().then(async () => {
        const syncPairs = [];
        for (const pair of pairs) {
          const key = await pair.key;
          const value = await pair.value;
          syncPairs.push({
            key,
            value,
            alwaysSet: pair.alwaysSet
          });
        }
        return syncPairs;
      }).then((syncPairs) => {
        return ParseStatus.mergeObjectSync(status, syncPairs);
      });
    } else {
      return ParseStatus.mergeObjectSync(status, pairs);
    }
  }
  get shape() {
    return this._def.shape();
  }
  strict(message) {
    errorUtil.errToObj;
    return new _ZodObject({
      ...this._def,
      unknownKeys: "strict",
      ...message !== void 0 ? {
        errorMap: (issue, ctx) => {
          const defaultError = this._def.errorMap?.(issue, ctx).message ?? ctx.defaultError;
          if (issue.code === "unrecognized_keys")
            return {
              message: errorUtil.errToObj(message).message ?? defaultError
            };
          return {
            message: defaultError
          };
        }
      } : {}
    });
  }
  strip() {
    return new _ZodObject({
      ...this._def,
      unknownKeys: "strip"
    });
  }
  passthrough() {
    return new _ZodObject({
      ...this._def,
      unknownKeys: "passthrough"
    });
  }
  // const AugmentFactory =
  //   <Def extends ZodObjectDef>(def: Def) =>
  //   <Augmentation extends ZodRawShape>(
  //     augmentation: Augmentation
  //   ): ZodObject<
  //     extendShape<ReturnType<Def["shape"]>, Augmentation>,
  //     Def["unknownKeys"],
  //     Def["catchall"]
  //   > => {
  //     return new ZodObject({
  //       ...def,
  //       shape: () => ({
  //         ...def.shape(),
  //         ...augmentation,
  //       }),
  //     }) as any;
  //   };
  extend(augmentation) {
    return new _ZodObject({
      ...this._def,
      shape: () => ({
        ...this._def.shape(),
        ...augmentation
      })
    });
  }
  /**
   * Prior to zod@1.0.12 there was a bug in the
   * inferred type of merged objects. Please
   * upgrade if you are experiencing issues.
   */
  merge(merging) {
    const merged = new _ZodObject({
      unknownKeys: merging._def.unknownKeys,
      catchall: merging._def.catchall,
      shape: () => ({
        ...this._def.shape(),
        ...merging._def.shape()
      }),
      typeName: ZodFirstPartyTypeKind.ZodObject
    });
    return merged;
  }
  // merge<
  //   Incoming extends AnyZodObject,
  //   Augmentation extends Incoming["shape"],
  //   NewOutput extends {
  //     [k in keyof Augmentation | keyof Output]: k extends keyof Augmentation
  //       ? Augmentation[k]["_output"]
  //       : k extends keyof Output
  //       ? Output[k]
  //       : never;
  //   },
  //   NewInput extends {
  //     [k in keyof Augmentation | keyof Input]: k extends keyof Augmentation
  //       ? Augmentation[k]["_input"]
  //       : k extends keyof Input
  //       ? Input[k]
  //       : never;
  //   }
  // >(
  //   merging: Incoming
  // ): ZodObject<
  //   extendShape<T, ReturnType<Incoming["_def"]["shape"]>>,
  //   Incoming["_def"]["unknownKeys"],
  //   Incoming["_def"]["catchall"],
  //   NewOutput,
  //   NewInput
  // > {
  //   const merged: any = new ZodObject({
  //     unknownKeys: merging._def.unknownKeys,
  //     catchall: merging._def.catchall,
  //     shape: () =>
  //       objectUtil.mergeShapes(this._def.shape(), merging._def.shape()),
  //     typeName: ZodFirstPartyTypeKind.ZodObject,
  //   }) as any;
  //   return merged;
  // }
  setKey(key, schema) {
    return this.augment({ [key]: schema });
  }
  // merge<Incoming extends AnyZodObject>(
  //   merging: Incoming
  // ): //ZodObject<T & Incoming["_shape"], UnknownKeys, Catchall> = (merging) => {
  // ZodObject<
  //   extendShape<T, ReturnType<Incoming["_def"]["shape"]>>,
  //   Incoming["_def"]["unknownKeys"],
  //   Incoming["_def"]["catchall"]
  // > {
  //   // const mergedShape = objectUtil.mergeShapes(
  //   //   this._def.shape(),
  //   //   merging._def.shape()
  //   // );
  //   const merged: any = new ZodObject({
  //     unknownKeys: merging._def.unknownKeys,
  //     catchall: merging._def.catchall,
  //     shape: () =>
  //       objectUtil.mergeShapes(this._def.shape(), merging._def.shape()),
  //     typeName: ZodFirstPartyTypeKind.ZodObject,
  //   }) as any;
  //   return merged;
  // }
  catchall(index) {
    return new _ZodObject({
      ...this._def,
      catchall: index
    });
  }
  pick(mask) {
    const shape = {};
    for (const key of util.objectKeys(mask)) {
      if (mask[key] && this.shape[key]) {
        shape[key] = this.shape[key];
      }
    }
    return new _ZodObject({
      ...this._def,
      shape: () => shape
    });
  }
  omit(mask) {
    const shape = {};
    for (const key of util.objectKeys(this.shape)) {
      if (!mask[key]) {
        shape[key] = this.shape[key];
      }
    }
    return new _ZodObject({
      ...this._def,
      shape: () => shape
    });
  }
  /**
   * @deprecated
   */
  deepPartial() {
    return deepPartialify(this);
  }
  partial(mask) {
    const newShape = {};
    for (const key of util.objectKeys(this.shape)) {
      const fieldSchema = this.shape[key];
      if (mask && !mask[key]) {
        newShape[key] = fieldSchema;
      } else {
        newShape[key] = fieldSchema.optional();
      }
    }
    return new _ZodObject({
      ...this._def,
      shape: () => newShape
    });
  }
  required(mask) {
    const newShape = {};
    for (const key of util.objectKeys(this.shape)) {
      if (mask && !mask[key]) {
        newShape[key] = this.shape[key];
      } else {
        const fieldSchema = this.shape[key];
        let newField = fieldSchema;
        while (newField instanceof ZodOptional) {
          newField = newField._def.innerType;
        }
        newShape[key] = newField;
      }
    }
    return new _ZodObject({
      ...this._def,
      shape: () => newShape
    });
  }
  keyof() {
    return createZodEnum(util.objectKeys(this.shape));
  }
};
ZodObject.create = (shape, params) => {
  return new ZodObject({
    shape: () => shape,
    unknownKeys: "strip",
    catchall: ZodNever.create(),
    typeName: ZodFirstPartyTypeKind.ZodObject,
    ...processCreateParams(params)
  });
};
ZodObject.strictCreate = (shape, params) => {
  return new ZodObject({
    shape: () => shape,
    unknownKeys: "strict",
    catchall: ZodNever.create(),
    typeName: ZodFirstPartyTypeKind.ZodObject,
    ...processCreateParams(params)
  });
};
ZodObject.lazycreate = (shape, params) => {
  return new ZodObject({
    shape,
    unknownKeys: "strip",
    catchall: ZodNever.create(),
    typeName: ZodFirstPartyTypeKind.ZodObject,
    ...processCreateParams(params)
  });
};
var ZodUnion = class extends ZodType {
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    const options = this._def.options;
    function handleResults(results) {
      for (const result of results) {
        if (result.result.status === "valid") {
          return result.result;
        }
      }
      for (const result of results) {
        if (result.result.status === "dirty") {
          ctx.common.issues.push(...result.ctx.common.issues);
          return result.result;
        }
      }
      const unionErrors = results.map((result) => new ZodError(result.ctx.common.issues));
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_union,
        unionErrors
      });
      return INVALID;
    }
    if (ctx.common.async) {
      return Promise.all(options.map(async (option) => {
        const childCtx = {
          ...ctx,
          common: {
            ...ctx.common,
            issues: []
          },
          parent: null
        };
        return {
          result: await option._parseAsync({
            data: ctx.data,
            path: ctx.path,
            parent: childCtx
          }),
          ctx: childCtx
        };
      })).then(handleResults);
    } else {
      let dirty = void 0;
      const issues = [];
      for (const option of options) {
        const childCtx = {
          ...ctx,
          common: {
            ...ctx.common,
            issues: []
          },
          parent: null
        };
        const result = option._parseSync({
          data: ctx.data,
          path: ctx.path,
          parent: childCtx
        });
        if (result.status === "valid") {
          return result;
        } else if (result.status === "dirty" && !dirty) {
          dirty = { result, ctx: childCtx };
        }
        if (childCtx.common.issues.length) {
          issues.push(childCtx.common.issues);
        }
      }
      if (dirty) {
        ctx.common.issues.push(...dirty.ctx.common.issues);
        return dirty.result;
      }
      const unionErrors = issues.map((issues2) => new ZodError(issues2));
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_union,
        unionErrors
      });
      return INVALID;
    }
  }
  get options() {
    return this._def.options;
  }
};
ZodUnion.create = (types, params) => {
  return new ZodUnion({
    options: types,
    typeName: ZodFirstPartyTypeKind.ZodUnion,
    ...processCreateParams(params)
  });
};
var getDiscriminator = (type) => {
  if (type instanceof ZodLazy) {
    return getDiscriminator(type.schema);
  } else if (type instanceof ZodEffects) {
    return getDiscriminator(type.innerType());
  } else if (type instanceof ZodLiteral) {
    return [type.value];
  } else if (type instanceof ZodEnum) {
    return type.options;
  } else if (type instanceof ZodNativeEnum) {
    return util.objectValues(type.enum);
  } else if (type instanceof ZodDefault) {
    return getDiscriminator(type._def.innerType);
  } else if (type instanceof ZodUndefined) {
    return [void 0];
  } else if (type instanceof ZodNull) {
    return [null];
  } else if (type instanceof ZodOptional) {
    return [void 0, ...getDiscriminator(type.unwrap())];
  } else if (type instanceof ZodNullable) {
    return [null, ...getDiscriminator(type.unwrap())];
  } else if (type instanceof ZodBranded) {
    return getDiscriminator(type.unwrap());
  } else if (type instanceof ZodReadonly) {
    return getDiscriminator(type.unwrap());
  } else if (type instanceof ZodCatch) {
    return getDiscriminator(type._def.innerType);
  } else {
    return [];
  }
};
var ZodDiscriminatedUnion = class _ZodDiscriminatedUnion extends ZodType {
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.object) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.object,
        received: ctx.parsedType
      });
      return INVALID;
    }
    const discriminator = this.discriminator;
    const discriminatorValue = ctx.data[discriminator];
    const option = this.optionsMap.get(discriminatorValue);
    if (!option) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_union_discriminator,
        options: Array.from(this.optionsMap.keys()),
        path: [discriminator]
      });
      return INVALID;
    }
    if (ctx.common.async) {
      return option._parseAsync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      });
    } else {
      return option._parseSync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      });
    }
  }
  get discriminator() {
    return this._def.discriminator;
  }
  get options() {
    return this._def.options;
  }
  get optionsMap() {
    return this._def.optionsMap;
  }
  /**
   * The constructor of the discriminated union schema. Its behaviour is very similar to that of the normal z.union() constructor.
   * However, it only allows a union of objects, all of which need to share a discriminator property. This property must
   * have a different value for each object in the union.
   * @param discriminator the name of the discriminator property
   * @param types an array of object schemas
   * @param params
   */
  static create(discriminator, options, params) {
    const optionsMap = /* @__PURE__ */ new Map();
    for (const type of options) {
      const discriminatorValues = getDiscriminator(type.shape[discriminator]);
      if (!discriminatorValues.length) {
        throw new Error(`A discriminator value for key \`${discriminator}\` could not be extracted from all schema options`);
      }
      for (const value of discriminatorValues) {
        if (optionsMap.has(value)) {
          throw new Error(`Discriminator property ${String(discriminator)} has duplicate value ${String(value)}`);
        }
        optionsMap.set(value, type);
      }
    }
    return new _ZodDiscriminatedUnion({
      typeName: ZodFirstPartyTypeKind.ZodDiscriminatedUnion,
      discriminator,
      options,
      optionsMap,
      ...processCreateParams(params)
    });
  }
};
function mergeValues(a, b) {
  const aType = getParsedType(a);
  const bType = getParsedType(b);
  if (a === b) {
    return { valid: true, data: a };
  } else if (aType === ZodParsedType.object && bType === ZodParsedType.object) {
    const bKeys = util.objectKeys(b);
    const sharedKeys = util.objectKeys(a).filter((key) => bKeys.indexOf(key) !== -1);
    const newObj = { ...a, ...b };
    for (const key of sharedKeys) {
      const sharedValue = mergeValues(a[key], b[key]);
      if (!sharedValue.valid) {
        return { valid: false };
      }
      newObj[key] = sharedValue.data;
    }
    return { valid: true, data: newObj };
  } else if (aType === ZodParsedType.array && bType === ZodParsedType.array) {
    if (a.length !== b.length) {
      return { valid: false };
    }
    const newArray = [];
    for (let index = 0; index < a.length; index++) {
      const itemA = a[index];
      const itemB = b[index];
      const sharedValue = mergeValues(itemA, itemB);
      if (!sharedValue.valid) {
        return { valid: false };
      }
      newArray.push(sharedValue.data);
    }
    return { valid: true, data: newArray };
  } else if (aType === ZodParsedType.date && bType === ZodParsedType.date && +a === +b) {
    return { valid: true, data: a };
  } else {
    return { valid: false };
  }
}
var ZodIntersection = class extends ZodType {
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    const handleParsed = (parsedLeft, parsedRight) => {
      if (isAborted(parsedLeft) || isAborted(parsedRight)) {
        return INVALID;
      }
      const merged = mergeValues(parsedLeft.value, parsedRight.value);
      if (!merged.valid) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.invalid_intersection_types
        });
        return INVALID;
      }
      if (isDirty(parsedLeft) || isDirty(parsedRight)) {
        status.dirty();
      }
      return { status: status.value, value: merged.data };
    };
    if (ctx.common.async) {
      return Promise.all([
        this._def.left._parseAsync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        }),
        this._def.right._parseAsync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        })
      ]).then(([left, right]) => handleParsed(left, right));
    } else {
      return handleParsed(this._def.left._parseSync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      }), this._def.right._parseSync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      }));
    }
  }
};
ZodIntersection.create = (left, right, params) => {
  return new ZodIntersection({
    left,
    right,
    typeName: ZodFirstPartyTypeKind.ZodIntersection,
    ...processCreateParams(params)
  });
};
var ZodTuple = class _ZodTuple extends ZodType {
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.array) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.array,
        received: ctx.parsedType
      });
      return INVALID;
    }
    if (ctx.data.length < this._def.items.length) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.too_small,
        minimum: this._def.items.length,
        inclusive: true,
        exact: false,
        type: "array"
      });
      return INVALID;
    }
    const rest = this._def.rest;
    if (!rest && ctx.data.length > this._def.items.length) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.too_big,
        maximum: this._def.items.length,
        inclusive: true,
        exact: false,
        type: "array"
      });
      status.dirty();
    }
    const items = [...ctx.data].map((item, itemIndex) => {
      const schema = this._def.items[itemIndex] || this._def.rest;
      if (!schema)
        return null;
      return schema._parse(new ParseInputLazyPath(ctx, item, ctx.path, itemIndex));
    }).filter((x) => !!x);
    if (ctx.common.async) {
      return Promise.all(items).then((results) => {
        return ParseStatus.mergeArray(status, results);
      });
    } else {
      return ParseStatus.mergeArray(status, items);
    }
  }
  get items() {
    return this._def.items;
  }
  rest(rest) {
    return new _ZodTuple({
      ...this._def,
      rest
    });
  }
};
ZodTuple.create = (schemas, params) => {
  if (!Array.isArray(schemas)) {
    throw new Error("You must pass an array of schemas to z.tuple([ ... ])");
  }
  return new ZodTuple({
    items: schemas,
    typeName: ZodFirstPartyTypeKind.ZodTuple,
    rest: null,
    ...processCreateParams(params)
  });
};
var ZodRecord = class _ZodRecord extends ZodType {
  get keySchema() {
    return this._def.keyType;
  }
  get valueSchema() {
    return this._def.valueType;
  }
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.object) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.object,
        received: ctx.parsedType
      });
      return INVALID;
    }
    const pairs = [];
    const keyType = this._def.keyType;
    const valueType = this._def.valueType;
    for (const key in ctx.data) {
      pairs.push({
        key: keyType._parse(new ParseInputLazyPath(ctx, key, ctx.path, key)),
        value: valueType._parse(new ParseInputLazyPath(ctx, ctx.data[key], ctx.path, key)),
        alwaysSet: key in ctx.data
      });
    }
    if (ctx.common.async) {
      return ParseStatus.mergeObjectAsync(status, pairs);
    } else {
      return ParseStatus.mergeObjectSync(status, pairs);
    }
  }
  get element() {
    return this._def.valueType;
  }
  static create(first, second, third) {
    if (second instanceof ZodType) {
      return new _ZodRecord({
        keyType: first,
        valueType: second,
        typeName: ZodFirstPartyTypeKind.ZodRecord,
        ...processCreateParams(third)
      });
    }
    return new _ZodRecord({
      keyType: ZodString.create(),
      valueType: first,
      typeName: ZodFirstPartyTypeKind.ZodRecord,
      ...processCreateParams(second)
    });
  }
};
var ZodMap = class extends ZodType {
  get keySchema() {
    return this._def.keyType;
  }
  get valueSchema() {
    return this._def.valueType;
  }
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.map) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.map,
        received: ctx.parsedType
      });
      return INVALID;
    }
    const keyType = this._def.keyType;
    const valueType = this._def.valueType;
    const pairs = [...ctx.data.entries()].map(([key, value], index) => {
      return {
        key: keyType._parse(new ParseInputLazyPath(ctx, key, ctx.path, [index, "key"])),
        value: valueType._parse(new ParseInputLazyPath(ctx, value, ctx.path, [index, "value"]))
      };
    });
    if (ctx.common.async) {
      const finalMap = /* @__PURE__ */ new Map();
      return Promise.resolve().then(async () => {
        for (const pair of pairs) {
          const key = await pair.key;
          const value = await pair.value;
          if (key.status === "aborted" || value.status === "aborted") {
            return INVALID;
          }
          if (key.status === "dirty" || value.status === "dirty") {
            status.dirty();
          }
          finalMap.set(key.value, value.value);
        }
        return { status: status.value, value: finalMap };
      });
    } else {
      const finalMap = /* @__PURE__ */ new Map();
      for (const pair of pairs) {
        const key = pair.key;
        const value = pair.value;
        if (key.status === "aborted" || value.status === "aborted") {
          return INVALID;
        }
        if (key.status === "dirty" || value.status === "dirty") {
          status.dirty();
        }
        finalMap.set(key.value, value.value);
      }
      return { status: status.value, value: finalMap };
    }
  }
};
ZodMap.create = (keyType, valueType, params) => {
  return new ZodMap({
    valueType,
    keyType,
    typeName: ZodFirstPartyTypeKind.ZodMap,
    ...processCreateParams(params)
  });
};
var ZodSet = class _ZodSet extends ZodType {
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.set) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.set,
        received: ctx.parsedType
      });
      return INVALID;
    }
    const def = this._def;
    if (def.minSize !== null) {
      if (ctx.data.size < def.minSize.value) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.too_small,
          minimum: def.minSize.value,
          type: "set",
          inclusive: true,
          exact: false,
          message: def.minSize.message
        });
        status.dirty();
      }
    }
    if (def.maxSize !== null) {
      if (ctx.data.size > def.maxSize.value) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.too_big,
          maximum: def.maxSize.value,
          type: "set",
          inclusive: true,
          exact: false,
          message: def.maxSize.message
        });
        status.dirty();
      }
    }
    const valueType = this._def.valueType;
    function finalizeSet(elements2) {
      const parsedSet = /* @__PURE__ */ new Set();
      for (const element of elements2) {
        if (element.status === "aborted")
          return INVALID;
        if (element.status === "dirty")
          status.dirty();
        parsedSet.add(element.value);
      }
      return { status: status.value, value: parsedSet };
    }
    const elements = [...ctx.data.values()].map((item, i) => valueType._parse(new ParseInputLazyPath(ctx, item, ctx.path, i)));
    if (ctx.common.async) {
      return Promise.all(elements).then((elements2) => finalizeSet(elements2));
    } else {
      return finalizeSet(elements);
    }
  }
  min(minSize, message) {
    return new _ZodSet({
      ...this._def,
      minSize: { value: minSize, message: errorUtil.toString(message) }
    });
  }
  max(maxSize, message) {
    return new _ZodSet({
      ...this._def,
      maxSize: { value: maxSize, message: errorUtil.toString(message) }
    });
  }
  size(size, message) {
    return this.min(size, message).max(size, message);
  }
  nonempty(message) {
    return this.min(1, message);
  }
};
ZodSet.create = (valueType, params) => {
  return new ZodSet({
    valueType,
    minSize: null,
    maxSize: null,
    typeName: ZodFirstPartyTypeKind.ZodSet,
    ...processCreateParams(params)
  });
};
var ZodFunction = class _ZodFunction extends ZodType {
  constructor() {
    super(...arguments);
    this.validate = this.implement;
  }
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.function) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.function,
        received: ctx.parsedType
      });
      return INVALID;
    }
    function makeArgsIssue(args, error) {
      return makeIssue({
        data: args,
        path: ctx.path,
        errorMaps: [ctx.common.contextualErrorMap, ctx.schemaErrorMap, getErrorMap(), en_default].filter((x) => !!x),
        issueData: {
          code: ZodIssueCode.invalid_arguments,
          argumentsError: error
        }
      });
    }
    function makeReturnsIssue(returns, error) {
      return makeIssue({
        data: returns,
        path: ctx.path,
        errorMaps: [ctx.common.contextualErrorMap, ctx.schemaErrorMap, getErrorMap(), en_default].filter((x) => !!x),
        issueData: {
          code: ZodIssueCode.invalid_return_type,
          returnTypeError: error
        }
      });
    }
    const params = { errorMap: ctx.common.contextualErrorMap };
    const fn = ctx.data;
    if (this._def.returns instanceof ZodPromise) {
      const me = this;
      return OK(async function(...args) {
        const error = new ZodError([]);
        const parsedArgs = await me._def.args.parseAsync(args, params).catch((e) => {
          error.addIssue(makeArgsIssue(args, e));
          throw error;
        });
        const result = await Reflect.apply(fn, this, parsedArgs);
        const parsedReturns = await me._def.returns._def.type.parseAsync(result, params).catch((e) => {
          error.addIssue(makeReturnsIssue(result, e));
          throw error;
        });
        return parsedReturns;
      });
    } else {
      const me = this;
      return OK(function(...args) {
        const parsedArgs = me._def.args.safeParse(args, params);
        if (!parsedArgs.success) {
          throw new ZodError([makeArgsIssue(args, parsedArgs.error)]);
        }
        const result = Reflect.apply(fn, this, parsedArgs.data);
        const parsedReturns = me._def.returns.safeParse(result, params);
        if (!parsedReturns.success) {
          throw new ZodError([makeReturnsIssue(result, parsedReturns.error)]);
        }
        return parsedReturns.data;
      });
    }
  }
  parameters() {
    return this._def.args;
  }
  returnType() {
    return this._def.returns;
  }
  args(...items) {
    return new _ZodFunction({
      ...this._def,
      args: ZodTuple.create(items).rest(ZodUnknown.create())
    });
  }
  returns(returnType) {
    return new _ZodFunction({
      ...this._def,
      returns: returnType
    });
  }
  implement(func) {
    const validatedFunc = this.parse(func);
    return validatedFunc;
  }
  strictImplement(func) {
    const validatedFunc = this.parse(func);
    return validatedFunc;
  }
  static create(args, returns, params) {
    return new _ZodFunction({
      args: args ? args : ZodTuple.create([]).rest(ZodUnknown.create()),
      returns: returns || ZodUnknown.create(),
      typeName: ZodFirstPartyTypeKind.ZodFunction,
      ...processCreateParams(params)
    });
  }
};
var ZodLazy = class extends ZodType {
  get schema() {
    return this._def.getter();
  }
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    const lazySchema = this._def.getter();
    return lazySchema._parse({ data: ctx.data, path: ctx.path, parent: ctx });
  }
};
ZodLazy.create = (getter, params) => {
  return new ZodLazy({
    getter,
    typeName: ZodFirstPartyTypeKind.ZodLazy,
    ...processCreateParams(params)
  });
};
var ZodLiteral = class extends ZodType {
  _parse(input) {
    if (input.data !== this._def.value) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        received: ctx.data,
        code: ZodIssueCode.invalid_literal,
        expected: this._def.value
      });
      return INVALID;
    }
    return { status: "valid", value: input.data };
  }
  get value() {
    return this._def.value;
  }
};
ZodLiteral.create = (value, params) => {
  return new ZodLiteral({
    value,
    typeName: ZodFirstPartyTypeKind.ZodLiteral,
    ...processCreateParams(params)
  });
};
function createZodEnum(values, params) {
  return new ZodEnum({
    values,
    typeName: ZodFirstPartyTypeKind.ZodEnum,
    ...processCreateParams(params)
  });
}
var ZodEnum = class _ZodEnum extends ZodType {
  _parse(input) {
    if (typeof input.data !== "string") {
      const ctx = this._getOrReturnCtx(input);
      const expectedValues = this._def.values;
      addIssueToContext(ctx, {
        expected: util.joinValues(expectedValues),
        received: ctx.parsedType,
        code: ZodIssueCode.invalid_type
      });
      return INVALID;
    }
    if (!this._cache) {
      this._cache = new Set(this._def.values);
    }
    if (!this._cache.has(input.data)) {
      const ctx = this._getOrReturnCtx(input);
      const expectedValues = this._def.values;
      addIssueToContext(ctx, {
        received: ctx.data,
        code: ZodIssueCode.invalid_enum_value,
        options: expectedValues
      });
      return INVALID;
    }
    return OK(input.data);
  }
  get options() {
    return this._def.values;
  }
  get enum() {
    const enumValues = {};
    for (const val of this._def.values) {
      enumValues[val] = val;
    }
    return enumValues;
  }
  get Values() {
    const enumValues = {};
    for (const val of this._def.values) {
      enumValues[val] = val;
    }
    return enumValues;
  }
  get Enum() {
    const enumValues = {};
    for (const val of this._def.values) {
      enumValues[val] = val;
    }
    return enumValues;
  }
  extract(values, newDef = this._def) {
    return _ZodEnum.create(values, {
      ...this._def,
      ...newDef
    });
  }
  exclude(values, newDef = this._def) {
    return _ZodEnum.create(this.options.filter((opt) => !values.includes(opt)), {
      ...this._def,
      ...newDef
    });
  }
};
ZodEnum.create = createZodEnum;
var ZodNativeEnum = class extends ZodType {
  _parse(input) {
    const nativeEnumValues = util.getValidEnumValues(this._def.values);
    const ctx = this._getOrReturnCtx(input);
    if (ctx.parsedType !== ZodParsedType.string && ctx.parsedType !== ZodParsedType.number) {
      const expectedValues = util.objectValues(nativeEnumValues);
      addIssueToContext(ctx, {
        expected: util.joinValues(expectedValues),
        received: ctx.parsedType,
        code: ZodIssueCode.invalid_type
      });
      return INVALID;
    }
    if (!this._cache) {
      this._cache = new Set(util.getValidEnumValues(this._def.values));
    }
    if (!this._cache.has(input.data)) {
      const expectedValues = util.objectValues(nativeEnumValues);
      addIssueToContext(ctx, {
        received: ctx.data,
        code: ZodIssueCode.invalid_enum_value,
        options: expectedValues
      });
      return INVALID;
    }
    return OK(input.data);
  }
  get enum() {
    return this._def.values;
  }
};
ZodNativeEnum.create = (values, params) => {
  return new ZodNativeEnum({
    values,
    typeName: ZodFirstPartyTypeKind.ZodNativeEnum,
    ...processCreateParams(params)
  });
};
var ZodPromise = class extends ZodType {
  unwrap() {
    return this._def.type;
  }
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.promise && ctx.common.async === false) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.promise,
        received: ctx.parsedType
      });
      return INVALID;
    }
    const promisified = ctx.parsedType === ZodParsedType.promise ? ctx.data : Promise.resolve(ctx.data);
    return OK(promisified.then((data) => {
      return this._def.type.parseAsync(data, {
        path: ctx.path,
        errorMap: ctx.common.contextualErrorMap
      });
    }));
  }
};
ZodPromise.create = (schema, params) => {
  return new ZodPromise({
    type: schema,
    typeName: ZodFirstPartyTypeKind.ZodPromise,
    ...processCreateParams(params)
  });
};
var ZodEffects = class extends ZodType {
  innerType() {
    return this._def.schema;
  }
  sourceType() {
    return this._def.schema._def.typeName === ZodFirstPartyTypeKind.ZodEffects ? this._def.schema.sourceType() : this._def.schema;
  }
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    const effect = this._def.effect || null;
    const checkCtx = {
      addIssue: (arg) => {
        addIssueToContext(ctx, arg);
        if (arg.fatal) {
          status.abort();
        } else {
          status.dirty();
        }
      },
      get path() {
        return ctx.path;
      }
    };
    checkCtx.addIssue = checkCtx.addIssue.bind(checkCtx);
    if (effect.type === "preprocess") {
      const processed = effect.transform(ctx.data, checkCtx);
      if (ctx.common.async) {
        return Promise.resolve(processed).then(async (processed2) => {
          if (status.value === "aborted")
            return INVALID;
          const result = await this._def.schema._parseAsync({
            data: processed2,
            path: ctx.path,
            parent: ctx
          });
          if (result.status === "aborted")
            return INVALID;
          if (result.status === "dirty")
            return DIRTY(result.value);
          if (status.value === "dirty")
            return DIRTY(result.value);
          return result;
        });
      } else {
        if (status.value === "aborted")
          return INVALID;
        const result = this._def.schema._parseSync({
          data: processed,
          path: ctx.path,
          parent: ctx
        });
        if (result.status === "aborted")
          return INVALID;
        if (result.status === "dirty")
          return DIRTY(result.value);
        if (status.value === "dirty")
          return DIRTY(result.value);
        return result;
      }
    }
    if (effect.type === "refinement") {
      const executeRefinement = (acc) => {
        const result = effect.refinement(acc, checkCtx);
        if (ctx.common.async) {
          return Promise.resolve(result);
        }
        if (result instanceof Promise) {
          throw new Error("Async refinement encountered during synchronous parse operation. Use .parseAsync instead.");
        }
        return acc;
      };
      if (ctx.common.async === false) {
        const inner = this._def.schema._parseSync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        });
        if (inner.status === "aborted")
          return INVALID;
        if (inner.status === "dirty")
          status.dirty();
        executeRefinement(inner.value);
        return { status: status.value, value: inner.value };
      } else {
        return this._def.schema._parseAsync({ data: ctx.data, path: ctx.path, parent: ctx }).then((inner) => {
          if (inner.status === "aborted")
            return INVALID;
          if (inner.status === "dirty")
            status.dirty();
          return executeRefinement(inner.value).then(() => {
            return { status: status.value, value: inner.value };
          });
        });
      }
    }
    if (effect.type === "transform") {
      if (ctx.common.async === false) {
        const base = this._def.schema._parseSync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        });
        if (!isValid(base))
          return INVALID;
        const result = effect.transform(base.value, checkCtx);
        if (result instanceof Promise) {
          throw new Error(`Asynchronous transform encountered during synchronous parse operation. Use .parseAsync instead.`);
        }
        return { status: status.value, value: result };
      } else {
        return this._def.schema._parseAsync({ data: ctx.data, path: ctx.path, parent: ctx }).then((base) => {
          if (!isValid(base))
            return INVALID;
          return Promise.resolve(effect.transform(base.value, checkCtx)).then((result) => ({
            status: status.value,
            value: result
          }));
        });
      }
    }
    util.assertNever(effect);
  }
};
ZodEffects.create = (schema, effect, params) => {
  return new ZodEffects({
    schema,
    typeName: ZodFirstPartyTypeKind.ZodEffects,
    effect,
    ...processCreateParams(params)
  });
};
ZodEffects.createWithPreprocess = (preprocess, schema, params) => {
  return new ZodEffects({
    schema,
    effect: { type: "preprocess", transform: preprocess },
    typeName: ZodFirstPartyTypeKind.ZodEffects,
    ...processCreateParams(params)
  });
};
var ZodOptional = class extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType === ZodParsedType.undefined) {
      return OK(void 0);
    }
    return this._def.innerType._parse(input);
  }
  unwrap() {
    return this._def.innerType;
  }
};
ZodOptional.create = (type, params) => {
  return new ZodOptional({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodOptional,
    ...processCreateParams(params)
  });
};
var ZodNullable = class extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType === ZodParsedType.null) {
      return OK(null);
    }
    return this._def.innerType._parse(input);
  }
  unwrap() {
    return this._def.innerType;
  }
};
ZodNullable.create = (type, params) => {
  return new ZodNullable({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodNullable,
    ...processCreateParams(params)
  });
};
var ZodDefault = class extends ZodType {
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    let data = ctx.data;
    if (ctx.parsedType === ZodParsedType.undefined) {
      data = this._def.defaultValue();
    }
    return this._def.innerType._parse({
      data,
      path: ctx.path,
      parent: ctx
    });
  }
  removeDefault() {
    return this._def.innerType;
  }
};
ZodDefault.create = (type, params) => {
  return new ZodDefault({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodDefault,
    defaultValue: typeof params.default === "function" ? params.default : () => params.default,
    ...processCreateParams(params)
  });
};
var ZodCatch = class extends ZodType {
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    const newCtx = {
      ...ctx,
      common: {
        ...ctx.common,
        issues: []
      }
    };
    const result = this._def.innerType._parse({
      data: newCtx.data,
      path: newCtx.path,
      parent: {
        ...newCtx
      }
    });
    if (isAsync(result)) {
      return result.then((result2) => {
        return {
          status: "valid",
          value: result2.status === "valid" ? result2.value : this._def.catchValue({
            get error() {
              return new ZodError(newCtx.common.issues);
            },
            input: newCtx.data
          })
        };
      });
    } else {
      return {
        status: "valid",
        value: result.status === "valid" ? result.value : this._def.catchValue({
          get error() {
            return new ZodError(newCtx.common.issues);
          },
          input: newCtx.data
        })
      };
    }
  }
  removeCatch() {
    return this._def.innerType;
  }
};
ZodCatch.create = (type, params) => {
  return new ZodCatch({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodCatch,
    catchValue: typeof params.catch === "function" ? params.catch : () => params.catch,
    ...processCreateParams(params)
  });
};
var ZodNaN = class extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.nan) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.nan,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return { status: "valid", value: input.data };
  }
};
ZodNaN.create = (params) => {
  return new ZodNaN({
    typeName: ZodFirstPartyTypeKind.ZodNaN,
    ...processCreateParams(params)
  });
};
var BRAND = Symbol("zod_brand");
var ZodBranded = class extends ZodType {
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    const data = ctx.data;
    return this._def.type._parse({
      data,
      path: ctx.path,
      parent: ctx
    });
  }
  unwrap() {
    return this._def.type;
  }
};
var ZodPipeline = class _ZodPipeline extends ZodType {
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.common.async) {
      const handleAsync = async () => {
        const inResult = await this._def.in._parseAsync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        });
        if (inResult.status === "aborted")
          return INVALID;
        if (inResult.status === "dirty") {
          status.dirty();
          return DIRTY(inResult.value);
        } else {
          return this._def.out._parseAsync({
            data: inResult.value,
            path: ctx.path,
            parent: ctx
          });
        }
      };
      return handleAsync();
    } else {
      const inResult = this._def.in._parseSync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      });
      if (inResult.status === "aborted")
        return INVALID;
      if (inResult.status === "dirty") {
        status.dirty();
        return {
          status: "dirty",
          value: inResult.value
        };
      } else {
        return this._def.out._parseSync({
          data: inResult.value,
          path: ctx.path,
          parent: ctx
        });
      }
    }
  }
  static create(a, b) {
    return new _ZodPipeline({
      in: a,
      out: b,
      typeName: ZodFirstPartyTypeKind.ZodPipeline
    });
  }
};
var ZodReadonly = class extends ZodType {
  _parse(input) {
    const result = this._def.innerType._parse(input);
    const freeze = (data) => {
      if (isValid(data)) {
        data.value = Object.freeze(data.value);
      }
      return data;
    };
    return isAsync(result) ? result.then((data) => freeze(data)) : freeze(result);
  }
  unwrap() {
    return this._def.innerType;
  }
};
ZodReadonly.create = (type, params) => {
  return new ZodReadonly({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodReadonly,
    ...processCreateParams(params)
  });
};
function cleanParams(params, data) {
  const p = typeof params === "function" ? params(data) : typeof params === "string" ? { message: params } : params;
  const p2 = typeof p === "string" ? { message: p } : p;
  return p2;
}
function custom(check, _params = {}, fatal) {
  if (check)
    return ZodAny.create().superRefine((data, ctx) => {
      const r = check(data);
      if (r instanceof Promise) {
        return r.then((r2) => {
          if (!r2) {
            const params = cleanParams(_params, data);
            const _fatal = params.fatal ?? fatal ?? true;
            ctx.addIssue({ code: "custom", ...params, fatal: _fatal });
          }
        });
      }
      if (!r) {
        const params = cleanParams(_params, data);
        const _fatal = params.fatal ?? fatal ?? true;
        ctx.addIssue({ code: "custom", ...params, fatal: _fatal });
      }
      return;
    });
  return ZodAny.create();
}
var late = {
  object: ZodObject.lazycreate
};
var ZodFirstPartyTypeKind;
(function(ZodFirstPartyTypeKind2) {
  ZodFirstPartyTypeKind2["ZodString"] = "ZodString";
  ZodFirstPartyTypeKind2["ZodNumber"] = "ZodNumber";
  ZodFirstPartyTypeKind2["ZodNaN"] = "ZodNaN";
  ZodFirstPartyTypeKind2["ZodBigInt"] = "ZodBigInt";
  ZodFirstPartyTypeKind2["ZodBoolean"] = "ZodBoolean";
  ZodFirstPartyTypeKind2["ZodDate"] = "ZodDate";
  ZodFirstPartyTypeKind2["ZodSymbol"] = "ZodSymbol";
  ZodFirstPartyTypeKind2["ZodUndefined"] = "ZodUndefined";
  ZodFirstPartyTypeKind2["ZodNull"] = "ZodNull";
  ZodFirstPartyTypeKind2["ZodAny"] = "ZodAny";
  ZodFirstPartyTypeKind2["ZodUnknown"] = "ZodUnknown";
  ZodFirstPartyTypeKind2["ZodNever"] = "ZodNever";
  ZodFirstPartyTypeKind2["ZodVoid"] = "ZodVoid";
  ZodFirstPartyTypeKind2["ZodArray"] = "ZodArray";
  ZodFirstPartyTypeKind2["ZodObject"] = "ZodObject";
  ZodFirstPartyTypeKind2["ZodUnion"] = "ZodUnion";
  ZodFirstPartyTypeKind2["ZodDiscriminatedUnion"] = "ZodDiscriminatedUnion";
  ZodFirstPartyTypeKind2["ZodIntersection"] = "ZodIntersection";
  ZodFirstPartyTypeKind2["ZodTuple"] = "ZodTuple";
  ZodFirstPartyTypeKind2["ZodRecord"] = "ZodRecord";
  ZodFirstPartyTypeKind2["ZodMap"] = "ZodMap";
  ZodFirstPartyTypeKind2["ZodSet"] = "ZodSet";
  ZodFirstPartyTypeKind2["ZodFunction"] = "ZodFunction";
  ZodFirstPartyTypeKind2["ZodLazy"] = "ZodLazy";
  ZodFirstPartyTypeKind2["ZodLiteral"] = "ZodLiteral";
  ZodFirstPartyTypeKind2["ZodEnum"] = "ZodEnum";
  ZodFirstPartyTypeKind2["ZodEffects"] = "ZodEffects";
  ZodFirstPartyTypeKind2["ZodNativeEnum"] = "ZodNativeEnum";
  ZodFirstPartyTypeKind2["ZodOptional"] = "ZodOptional";
  ZodFirstPartyTypeKind2["ZodNullable"] = "ZodNullable";
  ZodFirstPartyTypeKind2["ZodDefault"] = "ZodDefault";
  ZodFirstPartyTypeKind2["ZodCatch"] = "ZodCatch";
  ZodFirstPartyTypeKind2["ZodPromise"] = "ZodPromise";
  ZodFirstPartyTypeKind2["ZodBranded"] = "ZodBranded";
  ZodFirstPartyTypeKind2["ZodPipeline"] = "ZodPipeline";
  ZodFirstPartyTypeKind2["ZodReadonly"] = "ZodReadonly";
})(ZodFirstPartyTypeKind || (ZodFirstPartyTypeKind = {}));
var instanceOfType = (cls, params = {
  message: `Input not instance of ${cls.name}`
}) => custom((data) => data instanceof cls, params);
var stringType = ZodString.create;
var numberType = ZodNumber.create;
var nanType = ZodNaN.create;
var bigIntType = ZodBigInt.create;
var booleanType = ZodBoolean.create;
var dateType = ZodDate.create;
var symbolType = ZodSymbol.create;
var undefinedType = ZodUndefined.create;
var nullType = ZodNull.create;
var anyType = ZodAny.create;
var unknownType = ZodUnknown.create;
var neverType = ZodNever.create;
var voidType = ZodVoid.create;
var arrayType = ZodArray.create;
var objectType = ZodObject.create;
var strictObjectType = ZodObject.strictCreate;
var unionType = ZodUnion.create;
var discriminatedUnionType = ZodDiscriminatedUnion.create;
var intersectionType = ZodIntersection.create;
var tupleType = ZodTuple.create;
var recordType = ZodRecord.create;
var mapType = ZodMap.create;
var setType = ZodSet.create;
var functionType = ZodFunction.create;
var lazyType = ZodLazy.create;
var literalType = ZodLiteral.create;
var enumType = ZodEnum.create;
var nativeEnumType = ZodNativeEnum.create;
var promiseType = ZodPromise.create;
var effectsType = ZodEffects.create;
var optionalType = ZodOptional.create;
var nullableType = ZodNullable.create;
var preprocessType = ZodEffects.createWithPreprocess;
var pipelineType = ZodPipeline.create;
var ostring = () => stringType().optional();
var onumber = () => numberType().optional();
var oboolean = () => booleanType().optional();
var coerce = {
  string: (arg) => ZodString.create({ ...arg, coerce: true }),
  number: (arg) => ZodNumber.create({ ...arg, coerce: true }),
  boolean: (arg) => ZodBoolean.create({
    ...arg,
    coerce: true
  }),
  bigint: (arg) => ZodBigInt.create({ ...arg, coerce: true }),
  date: (arg) => ZodDate.create({ ...arg, coerce: true })
};
var NEVER = INVALID;

// ../contracts/dist/zones.js
var import_yaml = __toESM(require_dist(), 1);
var RiskLevel = external_exports.enum(["high", "medium", "low"]);
var DefaultPolicy = external_exports.enum(["deny", "read-only", "open"]);
var ZoneSchema = external_exports.object({
  id: external_exports.string().min(1).regex(/^[a-z0-9][a-z0-9-]*$/, "zone id must be kebab-case"),
  name: external_exports.string().min(1),
  risk: RiskLevel,
  owner: external_exports.string().min(1),
  description: external_exports.string().optional(),
  paths: external_exports.array(external_exports.string().min(1)).min(1, "a zone with no path patterns protects nothing"),
  default_policy: DefaultPolicy.default("deny"),
  /**
   * Zones holding secrets get stricter handling: reads are closed even under the
   * open-by-default rule (D-03), and Bash falls back to inspection-only because
   * the snapshot guard cannot see gitignored files — `.env` being both gitignored
   * and the archetypal secret is the sharpest open question Phase 0 handed on.
   */
  secrets: external_exports.boolean().default(false)
});
var ZonesConfigSchema = external_exports.object({
  /** Where spike work runs. Never against shared data. */
  spike_env: external_exports.string().nullable().default(null),
  /** Project-supplied command that drops spike_<task>_ tables. */
  spike_cleanup: external_exports.string().nullable().default(null),
  /** Project-supplied command whose empty output verifies nothing was left behind. */
  spike_verify: external_exports.string().nullable().default(null),
  /** Extra Bash commands this project considers safe to run under the guard. */
  extra_commands: external_exports.array(external_exports.string()).default([])
});
var ZonesFileSchema = external_exports.object({
  version: external_exports.literal(1),
  config: ZonesConfigSchema.default({}),
  /** Generated, not authored — exempt from the diff-vs-declared check (D-19). */
  generated: external_exports.array(external_exports.string()).default([]),
  /**
   * Paths a human looked at and left open, on purpose (flow C).
   *
   * Everything outside a zone is unprotected by default; this list exists so the
   * closing gate's "should this be protected?" question is asked ONCE per path
   * and the answer survives. Without it the same warning fires on the same 189
   * files at every close, and a warning that always fires is a warning nobody
   * reads. Glossary term: unprotected paths ("zona libre").
   */
  unprotected: external_exports.array(external_exports.string()).default([]),
  zones: external_exports.array(ZoneSchema).default([])
});
function parseZonesFile(source) {
  let raw;
  try {
    raw = (0, import_yaml.parse)(source);
  } catch (err) {
    return {
      ok: false,
      issues: [{ path: "", message: `not valid YAML: ${err.message}` }]
    };
  }
  const parsed = ZonesFileSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      issues: parsed.error.issues.map((i) => ({
        path: i.path.join("."),
        message: i.message
      }))
    };
  }
  const value = parsed.data;
  const warnings = [];
  const seen = /* @__PURE__ */ new Set();
  for (const [i, zone] of value.zones.entries()) {
    if (seen.has(zone.id)) {
      return { ok: false, issues: [{ path: `zones.${i}.id`, message: `duplicate zone id "${zone.id}"` }] };
    }
    seen.add(zone.id);
    for (const [j, pattern] of zone.paths.entries()) {
      if (!pattern.includes("*") && !pattern.includes(".")) {
        warnings.push({
          path: `zones.${i}.paths.${j}`,
          message: `"${pattern}" matches only the directory entry, not its contents \u2014 did you mean "${pattern}/**"?`
        });
      }
    }
  }
  return { ok: true, value, warnings };
}

// ../contracts/dist/globs.js
var import_picomatch = __toESM(require_picomatch2(), 1);
var foldsCase = () => typeof process !== "undefined" && process.platform === "darwin";
function compileZones(zones, opts = {}) {
  const caseFold = opts.caseFold ?? foldsCase();
  return zones.zones.map((zone) => ({
    zone,
    isMatch: (0, import_picomatch.default)(caseFold ? zone.paths.map((p) => p.toLowerCase()) : zone.paths, { dot: true })
  }));
}
function isGenerated(zones, relPath, opts = {}) {
  if (zones.generated.length === 0)
    return false;
  const caseFold = opts.caseFold ?? foldsCase();
  const patterns = caseFold ? zones.generated.map((p) => p.toLowerCase()) : zones.generated;
  return (0, import_picomatch.default)(patterns, { dot: true })(relPath);
}
function zoneFor(compiled, relPath) {
  return compiled.find((c) => c.isMatch(relPath))?.zone;
}

// ../contracts/dist/grant.js
var AccessModeSchema = external_exports.enum(["read", "write"]);
var OpenZoneSchema = external_exports.object({
  id: external_exports.string().min(1),
  mode: AccessModeSchema,
  /** Present when this zone was opened by an access request rather than the task spec. */
  approved_by: external_exports.string().optional(),
  reason: external_exports.string().optional(),
  /** Per-zone expiry, independent of the grant's own. JIT access expires by itself. */
  expires: external_exports.string().datetime().optional()
});
var HolderSchema = external_exports.object({
  path: external_exports.string().min(1),
  branch: external_exports.string().min(1)
});
var GrantSchema = external_exports.object({
  task_id: external_exports.string().min(1),
  tenant_id: external_exports.string().min(1).optional(),
  // D-42; the board writes it, D-49 is why it is signed
  repo_id: external_exports.string().min(1),
  // D-32
  branch: external_exports.string().min(1),
  // D-11: the binding between session and task
  mode: external_exports.enum(["standard", "spike"]).default("standard"),
  issued_at: external_exports.string().datetime(),
  expires: external_exports.string().datetime(),
  zones: external_exports.array(OpenZoneSchema).default([]),
  /**
   * Which checkout holds this grant (CC-50). Optional during the migration —
   * grants issued before this landed, and transitions from callers that do not
   * send a checkout path (the console), carry none. Signed with the rest of the
   * grant so a checkout cannot claim to hold what it does not; see
   * `signedPayload`.
   */
  holder: HolderSchema.optional(),
  /**
   * The board's signature over `signedPayload(grant)`, base64 (D-61, CC-471).
   *
   * **Declared here and verified nowhere in this file, on purpose.** The
   * verification needs a public key, and the key belongs to the enforcer rather
   * than to the shape — `packages/hook` holds it, inside a zone no task may
   * write. What this field must not be is invisible: a *security* field hidden
   * from the one implementation the hook, the Action, the CLI and the API all
   * import would be the drift D-30 bans, and the worst possible place to start
   * hiding something.
   *
   * Optional during the migration and not after. Every grant in existence when
   * this landed was unsigned, so a hook that refused them outright would deny
   * every write in every repository. The sequence is: the board signs, hooks
   * warn, then hooks refuse — and the day it becomes required is a decision on
   * the record, not a default flipped here.
   */
  sig: external_exports.string().min(1).optional()
});
function resolveGrant(raw, now = /* @__PURE__ */ new Date()) {
  const parsed = GrantSchema.safeParse(raw);
  if (!parsed.success)
    return { state: "none", reason: "no readable grant for this branch" };
  const grant = parsed.data;
  if (Date.parse(grant.expires) <= now.getTime())
    return { state: "expired", grant };
  const open = grant.zones.filter((z) => !z.expires || Date.parse(z.expires) > now.getTime());
  const effective = grant.mode === "spike" ? open.filter((z) => z.id !== "schema") : open;
  return { state: "active", grant, open: effective };
}

// ../contracts/dist/events.js
var EventType = external_exports.enum([
  "block",
  // a call was denied
  "zone_allow",
  // allowed inside a declared zone (unprotected paths are not logged — volume)
  "access_request",
  "approval",
  "reverted",
  // the Bash guard undid an out-of-zone write
  "mutation",
  // a file changed; the Layer 3 cross-check depends on these
  /* A tool the matrix does not recognise ran, and was allowed (CC-84).
   *
   * The matrix covers Edit, Write, Read and Bash. Everything else — MCP
   * servers, the browser tools — was allowed and left no trace, so the change
   * manifest was blind to whole classes of mutation. Measured 2026-08-06:
   * across 19 event logs and 1,311 events the only tools ever recorded were
   * Bash, Edit, Write and Read, while roughly a hundred MCP and browser calls
   * created board records, cancelled a task and rewrote five specs. Allowing
   * them is right — reading docs and driving a preview are legitimate — but
   * allowing them silently is what made the Layer 2 guarantee narrower than the
   * product claims while still reporting success. */
  "unwatched",
  /* A path that changed while nothing watched (CC-238).
   *
   * Written once per session start, when the hook finds the tree different
   * from the last snapshot anything observed and no event claims the change:
   * a downed core, a disabled plugin, a terminal, a colleague. The sibling of
   * `unwatched` with the opposite subject — there, a tool ran and the matrix
   * could not see WHAT it did; here, nothing ran through the hook at all and
   * the file says something happened anyway. The closing gate pairs these
   * with the diff by path, which turns a silent gap into a question a person
   * can answer (D-40). */
  "unwitnessed",
  "discard",
  "promote",
  "gate_lowered",
  "close"
]);
var EventSchema = external_exports.object({
  t: external_exports.string().datetime(),
  type: EventType,
  task_id: external_exports.string().min(1),
  repo_id: external_exports.string().min(1),
  // D-32
  tool: external_exports.string().optional(),
  path: external_exports.string().optional(),
  zone: external_exports.string().optional(),
  result: external_exports.enum(["allowed", "denied", "reverted"]).optional(),
  reason: external_exports.string().optional(),
  actor: external_exports.enum(["agent", "user", "platform"]).default("agent"),
  // Which rules observed this (CC-81). Optional: logs written before the
  // version contract existed must keep parsing — an event without a protocol
  // is old, not invalid.
  protocol: external_exports.number().int().positive().optional()
});

// ../contracts/dist/version.js
var PROTOCOL_VERSION = 1;
var PROTOCOL_HEADER = "cc-protocol";

// ../contracts/dist/closing.js
function checkClosing(input) {
  const { task, manifest, mutated, evidence } = input;
  const failures = [];
  const warnings = [];
  const zones = {
    version: 1,
    config: {},
    generated: input.generated,
    unprotected: input.unprotected ?? [],
    zones: input.zones.map((z) => ({
      id: z.zone_id,
      name: z.name,
      risk: z.risk,
      owner: z.owner,
      paths: z.paths,
      default_policy: z.default_policy,
      secrets: z.secrets
    }))
  };
  const reviewed = (path) => {
    const list = input.unprotected ?? [];
    if (!list.length)
      return false;
    return isGenerated({ ...zones, generated: list }, path);
  };
  if (!manifest) {
    return {
      failures: [{
        field: "manifest",
        message: "No change manifest. Run `cycle verify` on the branch \u2014 closing without knowing what changed is the thing this gate exists to prevent."
      }],
      warnings
    };
  }
  const declared = new Map(task.affected_zones.map((z) => [z.id, z.mode]));
  const compiled = compileZones(zones);
  const undeclaredZones = /* @__PURE__ */ new Set();
  const unzoned = [];
  for (const file of manifest.files) {
    if (isGenerated(zones, file.path))
      continue;
    const zone = zoneFor(compiled, file.path);
    if (!zone) {
      if (!reviewed(file.path))
        unzoned.push(file.path);
      continue;
    }
    if (!declared.has(zone.id))
      undeclaredZones.add(zone.id);
  }
  for (const id of undeclaredZones) {
    const touched = manifest.files.filter((f) => !isGenerated(zones, f.path) && zoneFor(compiled, f.path)?.id === id).map((f) => f.path);
    failures.push({
      field: "manifest",
      message: `Changed ${touched.length} file(s) in "${id}", which this task never declared: ${touched.slice(0, 3).join(", ")}${touched.length > 3 ? ` and ${touched.length - 3} more` : ""}. Either the scope was wrong or the work went further than intended \u2014 both are worth knowing before this closes.`
    });
  }
  if (unzoned.length) {
    warnings.push({
      field: "manifest",
      message: `${unzoned.length} changed file(s) are in no zone: ${unzoned.slice(0, 5).join(", ")}${unzoned.length > 5 ? ` and ${unzoned.length - 5} more` : ""}. Should any be protected? \`cycle protect <glob> --zone <id>\` if yes, \`cycle dismiss <glob>\` to stop being asked.`
    });
  }
  if (task.quality_gate && task.quality_gate !== "none" && evidence.length === 0) {
    failures.push({
      field: "evidence",
      message: `This task's quality gate is "${task.quality_gate}" and nothing has been attached. A URL to the preview, or a capture. Three fields, not a report.`
    });
  }
  const seen = new Set(mutated);
  const unrecorded = manifest.files.filter((f) => f.status !== "D").filter((f) => !isGenerated(zones, f.path)).filter((f) => !seen.has(f.path)).map((f) => f.path);
  if (unrecorded.length) {
    const list = `${unrecorded.slice(0, 3).join(", ")}${unrecorded.length > 3 ? ` and ${unrecorded.length - 3} more` : ""}`;
    if (mutated.length === 0) {
      warnings.push({
        field: "events",
        message: `Nothing observed this work: ${unrecorded.length} changed file(s) and no mutation events at all (${list}). That is what a hand-edited task looks like \u2014 but it is also what a task run with the hook switched off looks like, and from here they are the same.`
      });
    } else {
      const detail = `${unrecorded.length} changed file(s) have no mutation event, but ${mutated.length} other(s) do: ${list}. The hook was running and these files avoided it.`;
      if (input.override) {
        warnings.push({
          field: "events",
          message: `${detail} Overridden by ${input.override.by}: ${input.override.reason}`
        });
      } else {
        failures.push({ field: "events", message: detail });
      }
    }
  }
  return { failures, warnings };
}

// ../../apps/api/src/agents-block.ts
var CC_BEGIN = "<!-- cc:begin -->";
var CC_END = "<!-- cc:end -->";
var CC_BLOCK = /<!-- cc:begin -->[\s\S]*?<!-- cc:end -->/;
function hoursUntil(iso, now) {
  const mins = Math.round((Date.parse(iso) - now.getTime()) / 6e4);
  if (Number.isNaN(mins)) return "unknown";
  if (mins <= 0) return "already expired";
  return mins < 60 ? `about ${mins} minutes` : `about ${Math.round(mins / 60)} hours`;
}
function taskLines(task, zones, guarded, now, exists) {
  const openIds = new Set(task.open.map((z) => z.id));
  const lines = [
    `### You are working on ${task.id} \u2014 ${task.title}`,
    "",
    `Branch \`${task.branch}\`. Access expires in ${hoursUntil(task.expires, now)}.`,
    ""
  ];
  if (task.goal) lines.push(`**What it should do.** ${task.goal}`, "");
  if (task.non_goals) lines.push(`**What it must NOT do.** ${task.non_goals}`, "");
  lines.push(
    task.open.length ? "**Open to you right now**, and nothing else:" : "**No protected zone is open to this task.** Everything below is closed.",
    ""
  );
  for (const z of task.open) {
    const zone = zones.find((x) => x.id === z.id);
    lines.push(`- \`${z.id}\` \u2014 ${z.mode}: ${(zone?.paths ?? []).join(", ")}`);
  }
  if (task.open.length) lines.push("");
  if (task.topics?.length) {
    const books = task.topics.map((t) => `.zones/playbooks/${t}.md`).filter((rel) => exists(rel));
    if (books.length) {
      lines.push("**Read before working** \u2014 the playbooks for this task's topics:", "");
      for (const b of books) lines.push(`- ${b}`);
      lines.push("");
    }
  }
  const closed = zones.filter((z) => !openIds.has(z.id));
  if (closed.length) {
    lines.push(guarded ? "**Closed to this task.** You can read the list; you cannot write there:" : "**Closed to this task.** You may not write there \u2014 nothing is stopping you, so this one is on you:", "");
    for (const z of closed) lines.push(`- \`${z.id}\` (${z.default_policy}): ${z.paths.join(", ")}`);
    lines.push("");
  }
  return lines;
}
function enforcementLines(enforcement, guarded) {
  if (guarded) return [];
  return [
    "### Nothing here is enforcing this",
    "",
    enforcement === "off" ? "The zone map below is policy this repository agreed. **No software on this machine is\nchecking it** \u2014 there is no CommitCycle binary installed, so no write will be blocked." : "The zone map below is policy this repository agreed. Whether anything on this machine\nis checking it could not be determined, so assume nothing is.",
    "",
    "Treat it as binding anyway. The policy is real, the record is real, and the diff is",
    "checked against what the task declared when it closes \u2014 so a write outside the map",
    "is not stopped here, it is found there. Install the binary from the board to have it",
    "stopped at the write instead.",
    ""
  ];
}
function boardLines(board2) {
  if (!board2) return [];
  return [
    "### Where the tasks are",
    "",
    `This repository answers to the board \`${board2.tenant}/${board2.repo}\` at`,
    `${board2.url}. Tasks, their specs and the record of what was decided live there,`,
    "not in this repository \u2014 `.zones/board.json` is the binding.",
    "",
    "Nothing starts by editing files: a task is filed, scoped with four answers, and passes",
    "the gate, which is what issues the branch and opens whatever it is allowed to touch.",
    ""
  ];
}
function zonesListLines(zones) {
  const lines = ["### Protected zones", ""];
  for (const z of zones) {
    const why = z.reason ? ` \u2014 ${z.reason}` : "";
    lines.push(`- **${z.name}** (\`${z.id}\`, ${z.default_policy}): ${z.paths.join(", ")}${why}`);
  }
  return lines;
}
function blockedLine(guarded) {
  return guarded ? "If you are blocked, do not look for another route. Ask for access with a reason\nand an alternative, or carry on with the rest of the task and report the block." : "If a change needs one of these paths, do not just make it. Ask for access with a\nreason and an alternative, or carry on with the rest of the task and say you stopped.";
}
function unprotectedLine(hasTask, guarded) {
  return hasTask ? "Everything not listed above is unprotected \u2014 work there freely." : guarded ? "Everything not listed above is unprotected *inside an active task*. There is no\ntask here, so that opens nothing: writes are denied everywhere \u2014 unprotected paths\nincluded \u2014 until a task passes the gate and binds itself to a branch." : "Everything not listed above is unprotected *inside an active task*. There is no\ntask here, so that opens nothing: no write anywhere is authorized until a task\npasses the gate \u2014 nothing is stopping you, so this one is on you.";
}
var DEPLOYS_LINES = [
  "### Deploys",
  "",
  "Never remove `cycle guard-deploy` from a deploy command, and never set",
  "`CC_ALLOW_BRANCH_DEPLOY=1` to make a build pass \u2014 it exists so a branch cannot",
  "reach production, and a deploy that needs it gone is the deploy it was written for."
];
function renderDurableBlock(input) {
  const { zones } = input;
  const enforcement = input.enforcement ?? "unknown";
  const guarded = enforcement === "on";
  const lines = [CC_BEGIN, "## CommitCycle", ""];
  lines.push(...enforcementLines(enforcement, guarded));
  lines.push(...boardLines(input.board));
  lines.push(...zonesListLines(zones));
  lines.push("", blockedLine(guarded), "", ...DEPLOYS_LINES, CC_END);
  return lines.join("\n");
}
function renderEphemeralBlock(input) {
  const { zones, task } = input;
  const now = input.now ?? /* @__PURE__ */ new Date();
  const exists = input.playbookExists ?? (() => false);
  const guarded = (input.enforcement ?? "unknown") === "on";
  const lines = [CC_BEGIN, "## CommitCycle", ""];
  lines.push(...taskLines(task, zones, guarded, now, exists));
  lines.push(unprotectedLine(true, guarded), CC_END);
  return lines.join("\n");
}

// ../../apps/api/src/task-record.ts
function renderTaskRecord(r) {
  const zones = r.affected_zones ?? [];
  const criteria = r.acceptance_criteria ?? [];
  const zonesLine = zones.length ? zones.map((z) => `${z.id} (${z.mode})`).join(", ") : "None (unprotected paths).";
  return [
    "---",
    `id: ${r.id}`,
    `title: ${r.title}`,
    `state: ${r.state}`,
    "plan_task: \u2014",
    `owner: ${r.owner ?? "\u2014"}`,
    "mode: standard",
    `topics: [${(r.topics ?? []).join(", ")}]`,
    `branch: ${r.branch ?? "null"}`,
    "time_box: null",
    `quality_gate: ${r.quality_gate ?? "none"}`,
    `priority: ${r.priority ?? "none"}`,
    `created: ${r.created ?? ""}`,
    "---",
    "",
    `# ${r.id} \xB7 ${r.title}`,
    "",
    r.writtenBy,
    "",
    "## Goal",
    "",
    r.goal ?? "_not stated \u2014 the gate will refuse until it is_",
    "",
    "## Non-goals",
    "",
    r.non_goals ?? "_not stated_",
    "",
    "## Affected zones",
    "",
    zonesLine,
    "",
    "## Acceptance criteria",
    "",
    ...criteria.length ? criteria.map((c) => `- [ ] ${c}`) : ["- [ ] _none stated_"],
    "",
    "---",
    "",
    "## History",
    "",
    "| When | State | Note |",
    "|---|---|---|",
    ...r.history.map(([when, state, note]) => `| ${when} | ${state} | ${note} |`),
    ""
  ].join("\n");
}

// ../../apps/api/src/store.ts
var TOPICS = [
  "product",
  "design",
  "backend",
  "db",
  "frontend",
  "qa",
  "security",
  "release",
  "docs",
  "changelog",
  "enforcement"
];

// ../../apps/api/src/escalation.ts
var MAX_TTL_HOURS = 24 * 7;

// ../../apps/api/src/identity.ts
var enc = new TextEncoder();

// ../../apps/api/src/mail/index.ts
var TEMPLATES = {
  "sign-in-code": {
    title: "Sign-in code",
    when: "Sent on every sign-in and sign-up, from POST /v1/auth/code.",
    subject: "{{code}} \u2014 your CommitCycle code",
    text: [
      "{{code}} is your CommitCycle sign-in code.",
      "",
      "Type it back into the page that asked for it. It expires in {{ttl}} minutes and works once.",
      "Nobody at CommitCycle will ever ask you for it.",
      "",
      "If you did not ask for this, nothing has happened to your account and nothing needs doing:",
      "a code on its own signs nobody in.",
      "",
      "\u2014 CommitCycle"
    ].join("\n"),
    sample: { code: "482193", ttl: "10" }
  },
  "early-access": {
    title: "Early access",
    when: "Not sent yet \u2014 apps/web has no mail transport, and D-30 keeps this registry out of that app. Wiring it is its own task.",
    subject: "You're early \u2014 CommitCycle is already running",
    text: [
      "You're early.",
      "",
      "Not a waiting list \u2014 there is no queue to be in. CommitCycle is running today: boards, the",
      "gate, the audit trail, and a connector that sets a repository up from inside your editor.",
      "What you are early for is the invitation, because access stays invite-only while this is",
      "small.",
      "",
      "What you will run first:",
      "",
      "    cycle init",
      "",
      "You said you work in {{harness}}. That is the point of the whole thing: CommitCycle sits",
      "between the agent and the repository, so a write into somewhere risky gets stopped and asked",
      "about rather than found in the diff afterwards.",
      "",
      "Being straight about today: the board, the gate and the setup flow all work from the browser.",
      "Enforcement \u2014 the part that actually blocks a write \u2014 needs a small binary on your own",
      "machine, on purpose. Nothing that runs in someone else's cloud can stop a file being written",
      "on yours.",
      "",
      "Your invitation arrives at this address. The two questions you answered decide what gets built",
      "next and nothing else.",
      "",
      "\u2014 CommitCycle"
    ].join("\n"),
    sample: { harness: "Claude Code" }
  },
  invite: {
    title: "Invite a machine",
    when: "Not sent yet \u2014 the console hands this line over on screen. Built so the registry is exercised more than once.",
    subject: "Connect a machine to {{board}}",
    text: [
      "{{invitedBy}} wants to connect a machine to the CommitCycle board for {{board}}.",
      "",
      "Run this where the work happens \u2014 in a terminal, or in the editor session you already trust:",
      "",
      "    {{command}}",
      "",
      "It works once and expires in {{ttl}} minutes. Read it before you run it; anyone holding this",
      "line can connect a machine to that board until it expires, so treat it like a password.",
      "",
      "No `cycle` on that machine yet? Install the CommitCycle plugin in your editor first \u2014 it",
      "brings the command with it.",
      "",
      "\u2014 CommitCycle"
    ].join("\n"),
    sample: {
      board: "pow/commitcycle",
      invitedBy: "paulo@commitcycle.com",
      command: "cycle connect 7f3a91c4-2b8e-4d1a-9e77-c0a5b2d84f16",
      ttl: "10"
    }
  },
  "owner-approval": {
    title: "Access request for an owner",
    when: "Not sent yet \u2014 escalation.ts records the request and the console shows it. This is the notification that closes the loop.",
    subject: "{{requester}} needs {{mode}} on {{zone}}",
    text: [
      "{{requester}} is blocked on {{zone}}.",
      "",
      "They are asking for {{mode}} access to {{zone}}, which you own, for {{task}}.",
      "",
      "Why:",
      "    {{reason}}",
      "",
      "If you do nothing, they said they would: {{alternative}}",
      "",
      "Answer it in the console under Access requests, or from a terminal with `cycle requests`.",
      "Approving opens the zone for that one task, for as long as you say, and the trail records",
      "which door answered.",
      "",
      "You are getting this because zones.yml names you as the owner of {{zone}}.",
      "",
      "\u2014 CommitCycle"
    ].join("\n"),
    sample: {
      requester: "ana@commitcycle.com",
      zone: "Database schema",
      mode: "write",
      task: "CC-250 \u2014 Two organizations cannot both file their first access request",
      reason: "REQ ids are minted per scope from a count while the migration declares them globally unique, so the second tenant to escalate gets a 500. Fixing it means keying the table.",
      alternative: "Ship the mint change against a spike_ table and leave the migration for a follow-up."
    }
  }
};
var TEMPLATE_NAMES = Object.keys(TEMPLATES).sort();

// ../../apps/api/src/mcp-http.ts
init_tools_list();
init_status();

// ../../apps/api/src/interview/validate.ts
var DraftSchema = external_exports.object({
  refusal: external_exports.string().min(1).nullable().default(null),
  goal: external_exports.string().nullable().default(null),
  non_goals: external_exports.string().nullable().default(null),
  acceptance_criteria: external_exports.array(external_exports.string()).default([]),
  affected_zones: external_exports.array(external_exports.object({
    id: external_exports.string(),
    mode: external_exports.enum(["read", "write"]),
    why: external_exports.string().default("")
  })).default([]),
  quality_gate: external_exports.string().nullable().default(null),
  topics: external_exports.array(external_exports.string()).default([]),
  priority: external_exports.string().nullable().default(null),
  unknowns: external_exports.array(external_exports.string()).default([])
});

// ../../apps/api/src/seed/validate.ts
var ClaimSchema = external_exports.object({
  text: external_exports.string().min(1),
  cites: external_exports.array(external_exports.string().min(1)).min(1)
});
var SeedDraftSchema = external_exports.object({
  topic: external_exports.string(),
  description: external_exports.string().min(1).max(1024),
  mandate: external_exports.string().default(""),
  claims: external_exports.array(ClaimSchema).default([]),
  gaps: external_exports.array(external_exports.string()).default([]),
  feed_rule: external_exports.string().default("")
});
var SeedAnswerSchema = external_exports.object({
  drafts: external_exports.array(SeedDraftSchema).default([])
});

// ../../apps/api/src/seed/challenge.ts
var ProposalSchema = external_exports.object({
  title: external_exports.string().min(1).max(120),
  market_source: external_exports.string().min(1),
  local_consequence: external_exports.string().min(1),
  suggestion: external_exports.string().min(1)
});
var ChallengeAnswerSchema = external_exports.object({
  proposals: external_exports.array(ProposalSchema).default([])
});

// ../../apps/api/src/routes.ts
var startedAt = Date.now() > 0 ? (/* @__PURE__ */ new Date()).toISOString() : null;

// src/agents.ts
var BLOCK = CC_BLOCK;
function readZoneLines(root) {
  const path = join2(root, ".zones", "zones.yml");
  if (!existsSync(path)) return null;
  const parsed = parseZonesFile(readFileSync2(path, "utf8"));
  if (!parsed.ok) return null;
  return parsed.value.zones.map((z) => ({
    id: z.id,
    name: z.name,
    paths: z.paths,
    default_policy: z.default_policy
  }));
}
function detectEnforcement(root) {
  const configs = [
    [join2(root, ".claude", "settings.json"), (raw) => {
      const hooks = JSON.parse(raw).hooks;
      const pre = hooks?.PreToolUse?.[0]?.hooks?.[0]?.command;
      return typeof pre === "string" ? pre : null;
    }],
    [join2(root, ".codex", "hooks.json"), (raw) => {
      const hooks = JSON.parse(raw).hooks;
      const pre = hooks?.PreToolUse?.[0]?.command;
      return typeof pre === "string" ? pre : null;
    }]
  ];
  for (const [path, read] of configs) {
    if (!existsSync(path)) continue;
    try {
      const command = read(readFileSync2(path, "utf8"));
      const resolved2 = command?.replace("$CLAUDE_PROJECT_DIR", root);
      if (resolved2 && existsSync(isAbsolute2(resolved2) ? resolved2 : join2(root, resolved2))) return "on";
    } catch {
      continue;
    }
  }
  return "off";
}
var playbookReader = (root = ".") => (rel) => existsSync(join2(root, rel));
function readBoardBinding(root) {
  const path = join2(root, ".zones", "board.json");
  if (!existsSync(path)) return null;
  try {
    const raw = JSON.parse(readFileSync2(path, "utf8"));
    const url = typeof raw.api_url === "string" ? raw.api_url : "";
    const tenant = typeof raw.tenant === "string" ? raw.tenant : "";
    const repo = typeof raw.repo === "string" ? raw.repo : "";
    return url && tenant && repo ? { url, tenant, repo } : null;
  } catch {
    return null;
  }
}
function writeAgentsBlock(root, block) {
  const path = join2(root, "AGENTS.md");
  const existing = existsSync(path) ? readFileSync2(path, "utf8") : "";
  const next = BLOCK.test(existing) ? existing.replace(BLOCK, block) : (existing ? existing.trimEnd() + "\n\n" : "# Agent guide\n\n") + block + "\n";
  if (next === existing) return { path, changed: false };
  writeFileSync(path, next);
  return { path, changed: true };
}
var LOCAL_CONTEXT_FILE = "CLAUDE.local.md";
var LOCAL_PREAMBLE = "<!-- CommitCycle writes your active task here and removes it on hand-in.\n     Gitignored, so it never conflicts; keep your own notes outside the markers. -->";
function writeLocalBlock(root, block) {
  const path = join2(root, LOCAL_CONTEXT_FILE);
  const existing = existsSync(path) ? readFileSync2(path, "utf8") : "";
  const next = BLOCK.test(existing) ? existing.replace(BLOCK, block) : (existing ? existing.trimEnd() + "\n\n" : LOCAL_PREAMBLE + "\n\n") + block + "\n";
  if (next === existing) return { path, changed: false };
  writeFileSync(path, next);
  return { path, changed: true };
}
function clearLocalBlock(root) {
  const path = join2(root, LOCAL_CONTEXT_FILE);
  if (!existsSync(path)) return { path, changed: false };
  const existing = readFileSync2(path, "utf8");
  if (!BLOCK.test(existing)) return { path, changed: false };
  const rest = existing.replace(BLOCK, "").replace(LOCAL_PREAMBLE, "").trim();
  if (rest === "") {
    rmSync(path);
    return { path, changed: true };
  }
  writeFileSync(path, rest + "\n");
  return { path, changed: true };
}

// src/heal.ts
import { execFileSync } from "node:child_process";
import { existsSync as existsSync2, readFileSync as readFileSync4, writeFileSync as writeFileSync3 } from "node:fs";
import { join as join4 } from "node:path";

// ../../scripts/merge-agents.mjs
import { spawnSync } from "node:child_process";
import { readFileSync as readFileSync3, writeFileSync as writeFileSync2, rmSync as rmSync2 } from "node:fs";
import { dirname, basename, join as join3 } from "node:path";
var CC_BLOCK2 = /<!-- cc:begin -->[\s\S]*?<!-- cc:end -->/;
var PLACEHOLDER = "<!-- cc-merge-driver:placeholder -->";
function extractBlock(text) {
  const m = text.match(CC_BLOCK2);
  return m ? m[0] : null;
}
function neutralize(text) {
  return CC_BLOCK2.test(text) ? text.replace(CC_BLOCK2, PLACEHOLDER) : text;
}
function mergeNeutralized(oursN, baseN, theirsN, scratchDir) {
  const tag = `${process.pid}.${Math.random().toString(36).slice(2)}`;
  const stem = `AGENTS.md.cc-merge.${tag}`;
  const oursFile = join3(scratchDir, `${stem}.ours`);
  const baseFile = join3(scratchDir, `${stem}.base`);
  const theirsFile = join3(scratchDir, `${stem}.theirs`);
  try {
    writeFileSync2(oursFile, oursN);
    writeFileSync2(baseFile, baseN);
    writeFileSync2(theirsFile, theirsN);
    const res = spawnSync(
      "git",
      ["merge-file", "-p", "-L", "ours", "-L", "base", "-L", "theirs", oursFile, baseFile, theirsFile],
      { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 }
    );
    if (res.error || res.status === null || res.status < 0) {
      return { merged: null, conflict: true, ran: false };
    }
    return { merged: res.stdout, conflict: res.status !== 0, ran: true };
  } finally {
    for (const f of [oursFile, baseFile, theirsFile]) rmSync2(f, { force: true });
  }
}
function mergeAgents({ base, ours, theirs }, scratchDir) {
  const oursBlock = extractBlock(ours);
  const { merged, conflict, ran } = mergeNeutralized(
    neutralize(ours),
    neutralize(base),
    neutralize(theirs),
    scratchDir
  );
  if (!ran || merged === null) return { text: ours, conflict: true };
  const text = merged.split(PLACEHOLDER).join(oursBlock ?? "");
  return { text, conflict };
}
function runMergeDriver(basePath, oursPath, theirsPath) {
  const base = readFileSync3(basePath, "utf8");
  const ours = readFileSync3(oursPath, "utf8");
  const theirs = readFileSync3(theirsPath, "utf8");
  const { text, conflict } = mergeAgents({ base, ours, theirs }, dirname(oursPath) || ".");
  writeFileSync2(oursPath, text);
  return conflict ? 1 : 0;
}
var invokedDirectly = process.argv[1] && basename(process.argv[1]) === "merge-agents.mjs";
if (invokedDirectly) {
  const [, , basePath, oursPath, theirsPath] = process.argv;
  if (!basePath || !oursPath || !theirsPath) {
    process.stderr.write(
      "merge-agents: expected three paths (git passes %O %A %B). This is the cc-agents merge driver; git invokes it \u2014 you do not.\n"
    );
    process.exit(2);
  }
  process.exit(runMergeDriver(basePath, oursPath, theirsPath));
}

// src/heal.ts
var CC_AGENTS_MAPPING = /^\s*AGENTS\.md\s+.*\bmerge=cc-agents\b/m;
var CC_AGENTS_ATTRIBUTE = "AGENTS.md merge=cc-agents";
function driverCommand(root) {
  return existsSync2(join4(root, "scripts", "merge-agents.mjs")) ? "node scripts/merge-agents.mjs %O %A %B" : "cycle merge-driver %O %A %B";
}
function ensureMergeDriver(root) {
  const attrsPath = join4(root, ".gitattributes");
  let mapped = false;
  try {
    mapped = existsSync2(attrsPath) && CC_AGENTS_MAPPING.test(readFileSync4(attrsPath, "utf8"));
  } catch {
    return { status: "no-mapping" };
  }
  if (!mapped) return { status: "no-mapping" };
  try {
    const current = execFileSync("git", ["-C", root, "config", "--get", "merge.cc-agents.driver"], {
      stdio: ["ignore", "pipe", "ignore"]
    }).toString().trim();
    if (current) return { status: "present", command: current };
  } catch {
  }
  const command = driverCommand(root);
  try {
    execFileSync("git", ["-C", root, "config", "merge.cc-agents.driver", command], { stdio: "ignore" });
    try {
      execFileSync("git", ["-C", root, "config", "--get", "merge.cc-agents.name"], { stdio: "ignore" });
    } catch {
      execFileSync("git", [
        "-C",
        root,
        "config",
        "merge.cc-agents.name",
        "keep AGENTS.md's cc-managed block from conflicting (CC-543)"
      ], { stdio: "ignore" });
    }
    return { status: "registered", command };
  } catch {
    return { status: "failed" };
  }
}
var NO_HEAL = {
  changed: false,
  resolvedHunks: 0,
  humanHunks: 0,
  collapsedBlocks: 0,
  placeholdersRemoved: 0,
  unbalanced: false
};
function resolveCcHunks(text) {
  const lines = text.split("\n");
  const out = [];
  let resolved2 = 0;
  let human = 0;
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (!line.startsWith("<<<<<<< ")) {
      out.push(line);
      i++;
      continue;
    }
    const start = i;
    i++;
    const ours = [];
    const theirs = [];
    let section = "ours";
    let closed = false;
    for (; i < lines.length; i++) {
      const l = lines[i];
      if (section === "ours" && l.startsWith("||||||| ")) {
        section = "base";
        continue;
      }
      if ((section === "ours" || section === "base") && l === "=======") {
        section = "theirs";
        continue;
      }
      if (section === "theirs" && l.startsWith(">>>>>>> ")) {
        closed = true;
        i++;
        break;
      }
      if (section === "ours") ours.push(l);
      else if (section === "theirs") theirs.push(l);
    }
    if (!closed) {
      out.push(...lines.slice(start));
      break;
    }
    const oursText = ours.join("\n");
    if (neutralize(oursText) === neutralize(theirs.join("\n"))) {
      out.push(...ours);
      resolved2++;
    } else {
      out.push(...lines.slice(start, i));
      human++;
    }
  }
  return { text: out.join("\n"), resolved: resolved2, human };
}
function healAgentsFile(root) {
  const path = join4(root, "AGENTS.md");
  if (!existsSync2(path)) return NO_HEAL;
  const original = readFileSync4(path, "utf8");
  let text = original;
  const hunks = text.includes("<<<<<<< ") ? resolveCcHunks(text) : { text, resolved: 0, human: 0 };
  text = hunks.text;
  let placeholdersRemoved = 0;
  while (text.includes(PLACEHOLDER + "\n")) {
    text = text.replace(PLACEHOLDER + "\n", "");
    placeholdersRemoved++;
  }
  while (text.includes(PLACEHOLDER)) {
    text = text.replace(PLACEHOLDER, "");
    placeholdersRemoved++;
  }
  const begins = text.split("<!-- cc:begin -->").length - 1;
  const ends = text.split("<!-- cc:end -->").length - 1;
  if (begins !== ends) {
    if (text !== original) writeFileSync3(path, text);
    return {
      changed: text !== original,
      resolvedHunks: hunks.resolved,
      humanHunks: hunks.human,
      collapsedBlocks: 0,
      placeholdersRemoved,
      unbalanced: true
    };
  }
  const all = [...text.matchAll(new RegExp(CC_BLOCK.source, "g"))];
  let collapsedBlocks = 0;
  for (let k = all.length - 1; k >= 1; k--) {
    const m = all[k];
    const before = text.slice(0, m.index);
    const after = text.slice(m.index + m[0].length);
    text = before.replace(/\n{2,}$/, "\n\n") + after.replace(/^\n+/, "\n");
    collapsedBlocks++;
  }
  if (text === original) {
    return { ...NO_HEAL, humanHunks: hunks.human };
  }
  writeFileSync3(path, text);
  return {
    changed: true,
    resolvedHunks: hunks.resolved,
    humanHunks: hunks.human,
    collapsedBlocks,
    placeholdersRemoved,
    unbalanced: false
  };
}

// src/init.ts
import { dirname as dirname4, join as join10, relative as relative3 } from "node:path";

// src/board-config.ts
import { readFileSync as readFileSync7 } from "node:fs";
import { join as join7 } from "node:path";

// src/login.ts
import { chmodSync, mkdirSync, readFileSync as readFileSync5, writeFileSync as writeFileSync4 } from "node:fs";
import { homedir } from "node:os";
import { dirname as dirname2, join as join5 } from "node:path";
import { createInterface } from "node:readline/promises";

// src/protocol.ts
function boardHeaders(token) {
  const h = {
    "content-type": "application/json",
    [PROTOCOL_HEADER]: String(PROTOCOL_VERSION)
  };
  if (token) h.authorization = `Bearer ${token}`;
  const id = process.env.CC_ACCESS_CLIENT_ID;
  const secret = process.env.CC_ACCESS_CLIENT_SECRET;
  if (id && secret) {
    h["cf-access-client-id"] = id;
    h["cf-access-client-secret"] = secret;
  }
  return h;
}
function replyDrift(res) {
  const said = res.headers.get(PROTOCOL_HEADER);
  if (said === null) {
    return "the server did not identify its protocol \u2014 it predates the version contract (CC-81). Restart it from a current build.";
  }
  const n = Number(said);
  if (n === PROTOCOL_VERSION) return null;
  return n < PROTOCOL_VERSION ? `the server speaks cc-protocol ${said} and this CLI speaks ${PROTOCOL_VERSION} \u2014 the server is running an older build. Restart it.` : `the server speaks cc-protocol ${said} and this CLI speaks ${PROTOCOL_VERSION} \u2014 upgrade the CLI.`;
}
async function upgradeRequired(res) {
  if (res.status !== 426) return null;
  const body = await res.json().catch(() => ({}));
  return body.error ?? `the board requires a newer CLI (426) \u2014 upgrade and retry`;
}
async function boardCall(opts, path, init) {
  const doFetch = opts.fetchImpl ?? fetch;
  const warnings = [];
  const res = await doFetch(`${opts.apiUrl.replace(/\/+$/, "")}/v1/${opts.tenant}/${opts.repo}${path}`, {
    ...init,
    headers: boardHeaders(opts.token)
  });
  const drift = replyDrift(res);
  if (drift) warnings.push(drift);
  const tooOld = await upgradeRequired(res);
  if (tooOld) return { ok: false, message: tooOld, warnings };
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    return {
      ok: false,
      message: body.failures?.map((f) => f.message).join(" ") ?? body.error ?? `the board answered ${res.status}`,
      warnings
    };
  }
  return { ok: true, body: await res.json(), warnings };
}

// src/login.ts
var sessionPath = () => join5(homedir(), ".commitcycle", "session.json");
var norm = (apiUrl) => apiUrl.replace(/\/+$/, "");
function allSessions() {
  let raw;
  try {
    raw = JSON.parse(readFileSync5(sessionPath(), "utf8"));
  } catch {
    return [];
  }
  if (!raw || typeof raw !== "object") return [];
  const map = raw.sessions;
  if (map && typeof map === "object") {
    return Object.values(map).filter(
      (s) => Boolean(s && typeof s.api_url === "string" && typeof s.token === "string")
    );
  }
  const legacy = raw;
  return legacy.api_url && legacy.token ? [{ ...legacy }] : [];
}
function rememberSession(entry) {
  const kept = allSessions().filter(
    (s) => !(norm(s.api_url) === norm(entry.api_url) && s.email === entry.email)
  );
  const sessions = {};
  for (const s of [...kept, entry]) sessions[`${norm(s.api_url)}|${s.email}`] = s;
  const file = sessionPath();
  mkdirSync(dirname2(file), { recursive: true });
  writeFileSync4(file, `${JSON.stringify({ sessions }, null, 2)}
`);
  try {
    chmodSync(file, 384);
  } catch {
  }
}
function forgetSessions(apiUrl, email) {
  const before = allSessions();
  const kept = before.filter(
    (s) => !(norm(s.api_url) === norm(apiUrl) && (!email || s.email === email))
  );
  if (kept.length === before.length) return 0;
  const sessions = {};
  for (const s of kept) sessions[`${norm(s.api_url)}|${s.email}`] = s;
  const file = sessionPath();
  mkdirSync(dirname2(file), { recursive: true });
  writeFileSync4(file, `${JSON.stringify({ sessions }, null, 2)}
`);
  try {
    chmodSync(file, 384);
  } catch {
  }
  return before.length - kept.length;
}
function sessionFor(apiUrl, tenant) {
  const here = allSessions().filter((s) => norm(s.api_url) === norm(apiUrl));
  if (!here.length) return {};
  if (!tenant) return { session: here[here.length - 1] };
  const member = here.find((s) => s.organizations?.includes(tenant));
  if (member) return { session: member };
  const unknown = here.find((s) => !s.organizations);
  if (unknown) return { session: unknown };
  return { wrongTenant: { tenant, held: here } };
}
function savedToken(apiUrl, tenant) {
  const choice = sessionFor(apiUrl, tenant);
  return "session" in choice ? choice.session.token : void 0;
}
function savedIdentity(apiUrl, tenant) {
  const choice = sessionFor(apiUrl, tenant);
  if ("session" in choice) return choice.session.email;
  if ("wrongTenant" in choice) return choice.wrongTenant.held[0]?.email;
  return void 0;
}
async function runLogin(opts) {
  const doFetch = opts.fetchImpl ?? fetch;
  const log = opts.log ?? (() => {
  });
  const base = opts.apiUrl.replace(/\/+$/, "");
  const rl = opts.ask ? null : createInterface({ input: process.stdin, output: process.stdout });
  const ask = opts.ask ?? (async (q) => (await rl.question(q)).trim());
  try {
    const email = (opts.email ?? await ask("Email: ")).trim();
    if (!email) return { ok: false, failures: [{ field: "email", message: "An address is needed to send a code to." }] };
    const sent = await doFetch(`${base}/v1/auth/request-code`, {
      method: "POST",
      headers: boardHeaders(),
      body: JSON.stringify({ email })
    });
    const drift = replyDrift(sent);
    if (drift) log(`  note: protocol: ${drift}`);
    if (sent.status !== 202) {
      const body = await sent.json().catch(() => ({}));
      return {
        ok: false,
        failures: body.failures ?? [{ field: "email", message: body.error ?? `The board answered ${sent.status}.` }]
      };
    }
    const { dev_code: devCode } = await sent.json().catch(() => ({}));
    if (devCode) log(`  this board is not sending mail \u2014 your code is ${devCode}`);
    else log(`  a six-digit code is on its way to ${email}`);
    const code = (await ask("Code: ")).trim();
    const verified = await doFetch(`${base}/v1/auth/verify`, {
      method: "POST",
      headers: boardHeaders(),
      body: JSON.stringify({ email, code, label: "cli" })
    });
    if (verified.status !== 200) {
      const body = await verified.json().catch(() => ({}));
      return { ok: false, failures: body.failures ?? [{ field: "code", message: "That code is not valid." }] };
    }
    const { token, user, organizations } = await verified.json();
    rememberSession({
      api_url: base,
      email: user.email,
      token,
      saved_at: (/* @__PURE__ */ new Date()).toISOString(),
      organizations: (organizations ?? []).map((o) => o.id)
    });
    log(`  signed in as ${user.email}`);
    if (organizations?.length) log(`  projects: ${organizations.map((o) => o.id).join(", ")}`);
    else log("  no projects yet \u2014 create one in the console, or with `cycle project <name>`");
    const others = allSessions().filter((s) => s.api_url === base && s.email !== user.email);
    if (others.length) {
      log(`  also held here: ${others.map((s) => s.email).join(", ")} \u2014 each repository uses the identity that belongs to its organization`);
    }
    return { ok: true, email: user.email, failures: [] };
  } finally {
    rl?.close();
  }
}

// src/pair.ts
import { execFileSync as execFileSync2 } from "node:child_process";
import { chmodSync as chmodSync2, mkdirSync as mkdirSync2, readFileSync as readFileSync6, writeFileSync as writeFileSync5 } from "node:fs";
import { homedir as homedir2 } from "node:os";
import { dirname as dirname3, join as join6 } from "node:path";
var machinePath = () => join6(homedir2(), ".commitcycle", "machines.json");
function label(root) {
  const dir = root.split("/").pop() ?? "repo";
  try {
    const host = execFileSync2("hostname", { stdio: "pipe" }).toString().trim().replace(/\.local$/, "");
    return `${host} \xB7 ${dir}`;
  } catch {
    return dir;
  }
}
function remember(apiUrl, tenant, repo, token) {
  const path = machinePath();
  mkdirSync2(dirname3(path), { recursive: true });
  let all = {};
  try {
    all = JSON.parse(readFileSync6(path, "utf8"));
  } catch {
  }
  all[`${apiUrl.replace(/\/+$/, "")}|${tenant}/${repo}`] = { token, paired_at: (/* @__PURE__ */ new Date()).toISOString() };
  writeFileSync5(path, `${JSON.stringify(all, null, 2)}
`);
  chmodSync2(path, 384);
}
function machineToken(apiUrl, tenant, repo) {
  try {
    const all = JSON.parse(readFileSync6(machinePath(), "utf8"));
    return all[`${apiUrl.replace(/\/+$/, "")}|${tenant}/${repo}`]?.token;
  } catch {
    return void 0;
  }
}
async function runPair(opts) {
  const doFetch = opts.fetchImpl ?? fetch;
  const log = opts.log ?? (() => {
  });
  const sleep = opts.sleep ?? ((ms) => new Promise((r) => setTimeout(r, ms)));
  const base = opts.apiUrl.replace(/\/+$/, "");
  const started = await doFetch(`${base}/v1/pair`, {
    method: "POST",
    headers: boardHeaders(),
    body: JSON.stringify({ label: label(opts.root) })
  });
  if (!started.ok) {
    const body = await started.json().catch(() => ({}));
    return { ok: false, failures: [{ field: "board", message: body.error ?? `the board answered ${started.status}` }] };
  }
  const { code, poll_token: pollToken } = await started.json();
  log("");
  log(`  Your code:  ${code}`);
  log("");
  log(`  Open ${base}/pair, sign in, and enter it.`);
  log("  Pick the project and repository there \u2014 this machine does not choose them.");
  log("");
  log("  Waiting\u2026");
  const deadline = Date.now() + (opts.timeoutMs ?? 10 * 6e4);
  for (; ; ) {
    const res = await doFetch(`${base}/v1/pair/${pollToken}`, { headers: boardHeaders() });
    if (res.status === 410) {
      const body = await res.json().catch(() => ({}));
      return {
        ok: false,
        failures: [{ field: "code", message: body.failures?.[0]?.message ?? "That pairing is no longer usable." }]
      };
    }
    if (res.ok) {
      const body = await res.json();
      if (!body.pending && body.token && body.tenant && body.repo) {
        remember(base, body.tenant, body.repo, body.token);
        const boardPath = join6(opts.root, ".zones", "board.json");
        mkdirSync2(dirname3(boardPath), { recursive: true });
        writeFileSync5(boardPath, `${JSON.stringify({ api_url: base, tenant: body.tenant, repo: body.repo }, null, 2)}
`);
        return { ok: true, tenant: body.tenant, repo: body.repo, failures: [] };
      }
    }
    if (Date.now() > deadline) {
      return { ok: false, failures: [{ field: "code", message: "Nobody confirmed the code in time. Run `cycle pair` again." }] };
    }
    await sleep(2e3);
  }
}
async function runConnect(opts) {
  const doFetch = opts.fetchImpl ?? fetch;
  const base = opts.apiUrl.replace(/\/+$/, "");
  const res = await doFetch(`${base}/v1/pair/${encodeURIComponent(opts.ticket)}`, { headers: boardHeaders() });
  if (res.status === 410) {
    const body2 = await res.json().catch(() => ({}));
    return {
      ok: false,
      failures: [{
        field: "ticket",
        message: body2.failures?.[0]?.message ?? "That link has already been used or has expired. Mint a new one from the board."
      }]
    };
  }
  if (!res.ok) {
    return { ok: false, failures: [{ field: "board", message: `the board answered ${res.status}` }] };
  }
  const body = await res.json();
  if (body.pending || !body.token || !body.tenant || !body.repo) {
    return {
      ok: false,
      failures: [{ field: "ticket", message: "That link is not a connection invite. Copy it again from the board." }]
    };
  }
  remember(base, body.tenant, body.repo, body.token);
  const boardPath = join6(opts.root, ".zones", "board.json");
  mkdirSync2(dirname3(boardPath), { recursive: true });
  writeFileSync5(boardPath, `${JSON.stringify({ api_url: base, tenant: body.tenant, repo: body.repo }, null, 2)}
`);
  return { ok: true, tenant: body.tenant, repo: body.repo, failures: [] };
}

// src/board-config.ts
var tenantOf = (file) => process.env.CC_TENANT ?? (typeof file.tenant === "string" && file.tenant ? file.tenant : void 0);
var repoOf = (root, file) => process.env.CC_REPO_ID ?? (typeof file.repo === "string" && file.repo ? file.repo : root.split("/").pop() ?? "repo");
function resolveBoard(root) {
  let file = {};
  try {
    file = JSON.parse(readFileSync7(join7(root, ".zones", "board.json"), "utf8"));
  } catch {
  }
  const str3 = (v) => typeof v === "string" && v ? v : void 0;
  const apiUrl = process.env.CC_API_URL ?? str3(file.api_url);
  const tenant = tenantOf(file);
  const choice = apiUrl && tenant ? sessionFor(apiUrl, tenant) : {};
  const usingSession = !process.env.CC_TOKEN && !str3(file.token) && !(apiUrl && tenant && machineToken(apiUrl, tenant, repoOf(root, file)));
  return {
    apiUrl,
    tenant: process.env.CC_TENANT ?? str3(file.tenant),
    ...usingSession && "wrongTenant" in choice ? { wrongIdentity: { tenant: choice.wrongTenant.tenant, held: choice.wrongTenant.held.map((s) => s.email) } } : {},
    // Derived last: the directory name is usually right, and being wrong is
    // visible the moment the scope is printed.
    repo: process.env.CC_REPO_ID ?? str3(file.repo) ?? root.split("/").pop() ?? "repo",
    /* Last in the chain and first in ordinary use: the session `cycle login`
       stored (CC-147). It comes last so an explicit env var or a committed
       machine token still wins, and it is looked up BY BOARD — a session
       minted against localhost is not a credential for production, and a CLI
       that talks to both must never confuse them. */
    /* Env, then the file, then this machine's pairing, then the person's
       session. The machine token comes before the session because a paired
       laptop is the ordinary case for a CLI and the session is the one a
       browser holds — and it is scoped to one repository, so it is also the
       narrower of the two (CC-184). */
    token: process.env.CC_TOKEN ?? str3(file.token) ?? (apiUrl && tenant ? machineToken(apiUrl, tenant, repoOf(root, file)) : void 0) ?? (apiUrl ? savedToken(apiUrl, tenant) : void 0)
  };
}

// src/propose.ts
import { existsSync as existsSync3, readFileSync as readFileSync8, readdirSync, statSync as statSync2 } from "node:fs";
import { join as join8, relative } from "node:path";
var SKIP_DIRS = /* @__PURE__ */ new Set([
  "node_modules",
  ".git",
  "dist",
  "build",
  ".next",
  ".nuxt",
  ".output",
  "coverage",
  "vendor",
  ".venv",
  "__pycache__",
  ".turbo",
  ".cache"
]);
function walkDirs(root, maxDepth = 4) {
  const out = [];
  const visit = (dir, depth) => {
    if (depth > maxDepth) return;
    let entries;
    try {
      entries = readdirSync(dir);
    } catch {
      return;
    }
    for (const entry of entries) {
      if (SKIP_DIRS.has(entry) || entry.startsWith(".")) continue;
      const full = join8(dir, entry);
      try {
        if (!statSync2(full).isDirectory()) continue;
      } catch {
        continue;
      }
      out.push(relative(root, full));
      visit(full, depth + 1);
    }
  };
  visit(root, 0);
  return out;
}
var SIGNALS = [
  {
    id: "billing",
    name: "Billing and payments",
    risk: "high",
    dirs: ["billing", "payments", "payment", "checkout", "invoicing", "subscriptions"],
    keywords: ["stripe", "paddle", "braintree", "chargebee", "invoice"],
    policy: "read-only",
    why: (e) => `${e} \u2014 a mistake here charges real customers the wrong amount`
  },
  {
    id: "auth",
    name: "Authentication and sessions",
    risk: "high",
    dirs: ["auth", "authentication", "session", "sessions", "identity", "permissions", "rbac"],
    keywords: ["jsonwebtoken", "bcrypt", "argon2", "passport", "next-auth", "oauth"],
    policy: "read-only",
    why: (e) => `${e} \u2014 a mistake here lets the wrong people in`
  },
  {
    id: "infra",
    name: "Deployment and infrastructure",
    risk: "high",
    dirs: ["terraform", "infra", "infrastructure", "deploy", "k8s", "kubernetes", "helm"],
    policy: "read-only",
    why: (e) => `${e} \u2014 changes here reach production directly`
  },
  {
    id: "api-contracts",
    name: "Public API surface",
    risk: "medium",
    dirs: ["openapi", "graphql", "proto", "contracts", "schemas"],
    policy: "read-only",
    why: (e) => `${e} \u2014 other people's code depends on these shapes not changing`
  }
];
function schemaZone(root) {
  const paths = [
    "migrations/**",
    "**/migrations/**",
    "prisma/schema.prisma",
    "**/db/schema/**",
    "**/schema.sql"
  ].filter((p) => {
    if (p.includes("*")) return true;
    return existsSync3(join8(root, p));
  });
  return {
    id: "schema",
    name: "Database schema",
    risk: "high",
    reason: "migrations and table structure \u2014 the only thing a git revert does not undo",
    paths: paths.length ? paths : ["migrations/**", "**/migrations/**"],
    // read-only, not deny: an agent that cannot READ the current schema cannot
    // propose a sane change to it. The dry run caught this as its one false
    // positive, and D-03 already said reads are open unless a zone holds secrets.
    default_policy: "read-only",
    source: "system"
  };
}
function fileMentions(root, dir, keywords) {
  let entries;
  try {
    entries = readdirSync(join8(root, dir));
  } catch {
    return null;
  }
  for (const entry of entries.slice(0, 40)) {
    const full = join8(root, dir, entry);
    try {
      if (statSync2(full).isDirectory()) continue;
      if (!/\.(ts|tsx|js|jsx|mjs|py|rb|go|java|php)$/.test(entry)) continue;
      const text = readFileSync8(full, "utf8").slice(0, 2e4).toLowerCase();
      for (const kw of keywords) if (text.includes(kw)) return kw;
    } catch {
    }
  }
  return null;
}
function proposeFromHeuristics(root) {
  const dirs = walkDirs(root);
  const found = [];
  for (const signal of SIGNALS) {
    const matched = dirs.filter((d) => {
      const base = d.split("/").pop().toLowerCase();
      return signal.dirs.includes(base);
    });
    if (matched.length === 0) continue;
    let evidence = `directory ${matched[0]}/`;
    if (signal.keywords) {
      for (const dir of matched) {
        const kw = fileMentions(root, dir, signal.keywords);
        if (kw) {
          evidence = `${matched[0]}/ and it references "${kw}"`;
          break;
        }
      }
    }
    found.push({
      id: signal.id,
      name: signal.name,
      risk: signal.risk,
      reason: signal.why(evidence),
      paths: matched.map((d) => `${d}/**`),
      default_policy: signal.policy,
      secrets: signal.secrets,
      source: "heuristic"
    });
  }
  const envFiles = [".env", ".env.local", ".env.production"].filter((f) => existsSync3(join8(root, f)));
  if (envFiles.length) {
    found.push({
      id: "secrets",
      name: "Secrets and credentials",
      risk: "high",
      reason: `found ${envFiles.join(", ")} \u2014 these are the keys to everything else`,
      paths: [".env", ".env.*", "**/.env", "**/.env.*"],
      default_policy: "deny",
      secrets: true,
      source: "heuristic"
    });
  }
  return found;
}
function proposeFromKnowledgeGraph(root) {
  const file = join8(root, ".ua", "knowledge-graph.json");
  if (!existsSync3(file)) return [];
  let graph;
  try {
    graph = JSON.parse(readFileSync8(file, "utf8"));
  } catch {
    return [];
  }
  const byId = /* @__PURE__ */ new Map();
  for (const n of graph.fileNodes ?? []) if (n.id) byId.set(n.id, n);
  const RISKY = /(billing|payment|auth|session|security|infra|deploy|migration|schema|credential|secret)/i;
  const out = [];
  for (const layer of graph.layers ?? []) {
    const label2 = `${layer.name ?? ""} ${layer.description ?? ""}`;
    if (!RISKY.test(label2)) continue;
    const files = (layer.nodeIds ?? []).map((id) => byId.get(id)?.filePath).filter((p) => Boolean(p));
    if (files.length === 0) continue;
    const dirs = [...new Set(files.map((f) => f.split("/").slice(0, -1).join("/")).filter(Boolean))];
    out.push({
      id: (layer.name ?? layer.id ?? "zone").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
      name: layer.name ?? "Imported zone",
      risk: "high",
      reason: `mapped by Understand-Anything as "${layer.name}"${layer.description ? ` \u2014 ${layer.description}` : ""}`,
      paths: dirs.map((d) => `${d}/**`),
      default_policy: "deny",
      source: "knowledge-graph"
    });
  }
  return out;
}
function proposeZones(root) {
  const fromGraph = proposeFromKnowledgeGraph(root);
  const candidates = fromGraph.length ? fromGraph : proposeFromHeuristics(root);
  const seen = /* @__PURE__ */ new Set(["schema"]);
  const unique = candidates.filter((c) => {
    if (seen.has(c.id)) return false;
    seen.add(c.id);
    return true;
  });
  return [schemaZone(root), ...unique];
}

// src/validate.ts
var import_picomatch2 = __toESM(require_picomatch2(), 1);
import { readdirSync as readdirSync2, statSync as statSync3 } from "node:fs";
import { join as join9, relative as relative2 } from "node:path";
var SKIP = /* @__PURE__ */ new Set(["node_modules", ".git", "dist", "build", ".next", "coverage", ".turbo"]);
function listFiles(root, limit = 2e4) {
  const out = [];
  const visit = (dir) => {
    if (out.length >= limit) return;
    let entries;
    try {
      entries = readdirSync2(dir);
    } catch {
      return;
    }
    for (const entry of entries) {
      if (SKIP.has(entry)) continue;
      const full = join9(dir, entry);
      try {
        if (statSync3(full).isDirectory()) visit(full);
        else out.push(relative2(root, full).split("\\").join("/"));
      } catch {
      }
      if (out.length >= limit) return;
    }
  };
  visit(root);
  return out;
}
function validateCandidates(root, candidates) {
  const files = listFiles(root);
  const findings = [];
  const accepted = [];
  const seenIds = /* @__PURE__ */ new Set();
  for (const c of candidates) {
    let reject = false;
    if (!/^[a-z0-9][a-z0-9-]*$/.test(c.id)) {
      findings.push({ candidate: c.id, severity: "reject", message: "zone id must be kebab-case" });
      reject = true;
    }
    if (seenIds.has(c.id)) {
      findings.push({ candidate: c.id, severity: "reject", message: "duplicate zone id" });
      reject = true;
    }
    if (c.paths.length === 0) {
      findings.push({ candidate: c.id, severity: "reject", message: "a zone with no path patterns protects nothing" });
      reject = true;
    }
    for (const p of c.paths) {
      if (!p.includes("*") && !p.includes(".")) {
        findings.push({
          candidate: c.id,
          severity: "warn",
          message: `"${p}" matches only the directory entry, not its contents \u2014 should be "${p}/**"`
        });
      }
    }
    if (!reject && c.source !== "system") {
      const isMatch = (0, import_picomatch2.default)(c.paths, { dot: true });
      const matched = files.filter((f) => isMatch(f));
      if (matched.length === 0) {
        findings.push({
          candidate: c.id,
          severity: "reject",
          message: "its patterns match no file in this repository, so it would protect nothing"
        });
        reject = true;
      } else if (matched.length > files.length * 0.5) {
        findings.push({
          candidate: c.id,
          severity: "warn",
          message: `covers ${matched.length} of ${files.length} files \u2014 a zone this wide will block ordinary work`
        });
      }
    }
    if (!reject) {
      seenIds.add(c.id);
      accepted.push(c);
    }
  }
  return { accepted, findings };
}

// src/init.ts
var NO_OWNER = "TODO@example.com";
function mcpJson(cliPath) {
  return `${JSON.stringify({
    mcpServers: {
      commitcycle: { command: "node", args: [cliPath, "mcp"] }
    }
  }, null, 2)}
`;
}
function proposedOwner(root) {
  const board2 = resolveBoard(root);
  const signedIn = board2.apiUrl ? savedIdentity(board2.apiUrl) : void 0;
  if (signedIn) return { owner: signedIn, from: "the account you are signed in as" };
  try {
    const git3 = execFileSync3("git", ["config", "user.email"], { cwd: root, stdio: "pipe" }).toString().trim();
    if (git3) return { owner: git3, from: "your git identity" };
  } catch {
  }
  return { owner: NO_OWNER, from: "nothing on this machine names you" };
}
function yaml(zones, owner) {
  const lines = [
    "# CC zone map \u2014 the parts of this codebase that are dangerous to touch.",
    "# Everything not listed here is unprotected: no approval needed inside a task.",
    "#",
    "# Written by `cycle init`. Edit it freely \u2014 it is yours, and it is meant to grow",
    "# by use rather than by a documentation project.",
    "",
    "version: 1",
    "",
    "config:",
    "  spike_env: local",
    "  spike_cleanup: null",
    "  spike_verify: null",
    "  extra_commands: []",
    "",
    "# Generated, not authored \u2014 exempt from the diff-vs-declared check.",
    "generated:",
    "  - pnpm-lock.yaml",
    "  - package-lock.json",
    '  - "**/dist/**"',
    "",
    "zones:"
  ];
  for (const z of zones) {
    lines.push(`  - id: ${z.id}`);
    lines.push(`    name: ${JSON.stringify(z.name)}`);
    lines.push(`    risk: ${z.risk}`);
    lines.push(`    owner: ${owner}   # who approves access to this zone`);
    lines.push(`    description: ${JSON.stringify(z.reason)}`);
    lines.push(`    paths:`);
    for (const p of z.paths) lines.push(`      - ${JSON.stringify(p)}`);
    lines.push(`    default_policy: ${z.default_policy}`);
    if (z.secrets) lines.push(`    secrets: true`);
    lines.push("");
  }
  return lines.join("\n");
}
function settingsJson(hookPath) {
  return JSON.stringify(
    {
      hooks: {
        PreToolUse: [{ matcher: "*", hooks: [{ type: "command", command: hookPath, timeout: 5 }] }],
        PostToolUse: [{ matcher: "*", hooks: [{ type: "command", command: hookPath, timeout: 10 }] }]
      }
    },
    null,
    2
  ) + "\n";
}
function codexHooksJson(hookPath) {
  return JSON.stringify(
    {
      hooks: {
        PreToolUse: [{ command: hookPath, timeout_ms: 5e3 }],
        PostToolUse: [{ command: hookPath, timeout_ms: 1e4 }]
      }
    },
    null,
    2
  ) + "\n";
}
function configureAgentsMergeDriver(root, log) {
  const wrote = [];
  const attrsPath = join10(root, ".gitattributes");
  const current = existsSync4(attrsPath) ? readFileSync9(attrsPath, "utf8") : "";
  if (!CC_AGENTS_MAPPING.test(current)) {
    writeFileSync6(attrsPath, (current ? current.trimEnd() + "\n" : "") + CC_AGENTS_ATTRIBUTE + "\n");
    wrote.push(relative3(root, attrsPath));
  }
  if (ensureMergeDriver(root).status === "failed") {
    log("\n  Could not register the AGENTS.md merge driver in git config \u2014 `cycle doctor` has the one-liner.");
  }
  return wrote;
}
function ensureClaudeImportsAgents(root) {
  const path = join10(root, "CLAUDE.md");
  const existing = existsSync4(path) ? readFileSync9(path, "utf8") : "";
  if (/^\s*@\.?\/?AGENTS\.md\s*$/m.test(existing)) return [];
  const preamble = "# Agent guide\n\nThe durable agent guide \u2014 the zone map, the board and the deploy rule \u2014 lives in\nAGENTS.md so every tool reads one copy. Claude Code loads it through the import\nbelow. Your active task is written to CLAUDE.local.md by `cycle start`.\n\n";
  const next = existing ? existing.trimEnd() + "\n\n@AGENTS.md\n" : preamble + "@AGENTS.md\n";
  writeFileSync6(path, next);
  return [relative3(root, path)];
}
async function runInit(opts) {
  const { root, acceptAll = false, log = () => {
  } } = opts;
  const ask = opts.ask ?? (async () => true);
  const proposed = proposeZones(root);
  const { accepted: valid, findings } = validateCandidates(root, proposed);
  for (const f of findings.filter((x) => x.severity === "reject")) {
    log(`  skipped ${f.candidate}: ${f.message}`);
  }
  const accepted = [];
  const declined = [];
  for (const c of valid) {
    if (c.source === "system") {
      accepted.push(c);
      continue;
    }
    const yes = acceptAll || await ask(`${c.name} \u2014 ${c.reason}
  Paths: ${c.paths.join(", ")}
  Is this dangerous to change?`);
    (yes ? accepted : declined).push(c);
  }
  const proposal = proposedOwner(root);
  let owner = NO_OWNER;
  if (proposal.owner === NO_OWNER) {
    log(`
  Zone owners are left as ${NO_OWNER} \u2014 ${proposal.from}.`);
    log("  Fill them in before a high-risk zone is declared: the gate asks the owner, and it cannot ask nobody.");
  } else if (acceptAll || await ask(`Own the protected zones as ${proposal.owner}? (${proposal.from})`)) {
    owner = proposal.owner;
  } else {
    log(`
  Left as ${NO_OWNER}. Edit the owner field in .zones/zones.yml \u2014 the gate asks whoever it names.`);
  }
  const zonesYml = yaml(accepted, owner);
  const wrote = [];
  const zonesPath = join10(root, ".zones", "zones.yml");
  mkdirSync3(dirname4(zonesPath), { recursive: true });
  writeFileSync6(zonesPath, zonesYml);
  wrote.push(relative3(root, zonesPath));
  const hookPath = opts.hookPath ?? "$CLAUDE_PROJECT_DIR/node_modules/@commitcycle/hook/bin/cc-hook.sh";
  const settingsPath = join10(root, ".claude", "settings.json");
  mkdirSync3(dirname4(settingsPath), { recursive: true });
  if (existsSync4(settingsPath)) {
    wrote.push(`${relative3(root, settingsPath)} (already exists \u2014 left alone, add the hook yourself)`);
  } else {
    writeFileSync6(settingsPath, settingsJson(hookPath));
    wrote.push(relative3(root, settingsPath));
  }
  const codexPath = join10(root, ".codex", "hooks.json");
  mkdirSync3(dirname4(codexPath), { recursive: true });
  if (existsSync4(codexPath)) {
    wrote.push(`${relative3(root, codexPath)} (already exists \u2014 left alone, add the hook yourself)`);
  } else {
    writeFileSync6(codexPath, codexHooksJson(hookPath.replace("$CLAUDE_PROJECT_DIR/", "./")));
    wrote.push(relative3(root, codexPath));
  }
  const mcpPath = join10(root, ".mcp.json");
  const cliPath = existsSync4(join10(root, "packages", "cli", "dist", "index.js")) ? "packages/cli/dist/index.js" : "node_modules/@commitcycle/cli/dist/index.js";
  if (existsSync4(mcpPath)) {
    wrote.push(`${relative3(root, mcpPath)} (already exists \u2014 left alone, add the server yourself)`);
  } else {
    writeFileSync6(mcpPath, mcpJson(cliPath));
    wrote.push(relative3(root, mcpPath));
  }
  const agents = writeAgentsBlock(root, renderDurableBlock({
    zones: accepted,
    // Written a few lines above this point, so Layer 1 can name the board from
    // the moment it exists rather than at the next `cycle sync` (CC-202).
    board: readBoardBinding(root),
    /* Checked, not assumed (CC-209). `cycle init` usually installs the hook and
       this answers `on` — but it is asked rather than presumed, because the
       run that skipped the hook is exactly the one that must not claim a wall. */
    enforcement: detectEnforcement(root)
  }));
  wrote.push(relative3(root, agents.path));
  wrote.push(...ensureClaudeImportsAgents(root));
  wrote.push(...configureAgentsMergeDriver(root, log));
  const gitignore = join10(root, ".gitignore");
  const current = existsSync4(gitignore) ? readFileSync9(gitignore, "utf8") : "";
  let ignore = current;
  const ensureIgnored = (line, why) => {
    if (ignore.split("\n").some((l) => l.trim() === line)) return;
    ignore = (ignore ? ignore.trimEnd() + "\n\n" : "") + `# ${why}
${line}
`;
  };
  ensureIgnored(".zones/state/", "CC runtime state \u2014 grants, events, guard snapshots");
  ensureIgnored("CLAUDE.local.md", "CC ephemeral task context \u2014 written by `cycle start`, never committed");
  if (ignore !== current) {
    writeFileSync6(gitignore, ignore);
    wrote.push(".gitignore");
  }
  const boardPath = join10(root, ".zones", "board.json");
  if (opts.askText && !existsSync4(boardPath)) try {
    const existing = resolveBoard(root);
    const apiUrl = (await opts.askText("Which board does this repository report to?", existing.apiUrl ?? "https://dash.commitcycle.com")).trim();
    const tenant = apiUrl ? (await opts.askText("Which organization? (the first half of the address in the console)", existing.tenant)).trim() : "";
    if (apiUrl && tenant) {
      const repoId = (await opts.askText("And the repo id?", root.split("/").pop() ?? "repo")).trim() || (root.split("/").pop() ?? "repo");
      mkdirSync3(dirname4(boardPath), { recursive: true });
      writeFileSync6(boardPath, `${JSON.stringify({ api_url: apiUrl, tenant, repo: repoId }, null, 2)}
`);
      wrote.push(relative3(root, boardPath));
    } else {
      log("\n  No board named, so nothing was written for one.");
      log("  Everything local still works \u2014 the hook, the zone map, `cycle status`.");
      log("  `cycle start`, `cycle sync` and `cycle submit` will refuse until .zones/board.json names one.");
    }
  } catch {
    log("\n  No board named, so nothing was written for one.");
    log("  Everything installed above still works \u2014 add one later by running `cycle init` again.");
  }
  return {
    zonesYml,
    accepted,
    declined,
    wrote,
    warnings: findings.filter((f) => f.severity === "warn").map((f) => `${f.candidate}: ${f.message}`)
  };
}

// src/doctor.ts
import { execFileSync as execFileSync7 } from "node:child_process";
import { existsSync as existsSync11, readdirSync as readdirSync6, readFileSync as readFileSync14, statSync as statSync5 } from "node:fs";
import { dirname as dirname10, join as join16, resolve as resolve3, sep } from "node:path";

// src/pull.ts
import { existsSync as existsSync6, mkdirSync as mkdirSync5, readdirSync as readdirSync3, readFileSync as readFileSync10, writeFileSync as writeFileSync7 } from "node:fs";
import { dirname as dirname6, join as join12 } from "node:path";

// src/own-writes.ts
import { appendFileSync, existsSync as existsSync5, mkdirSync as mkdirSync4 } from "node:fs";
import { dirname as dirname5, join as join11, relative as relative4, resolve } from "node:path";
var eventLogPath = (root, taskId) => join11(root, ".zones", "state", "events", `${taskId}.jsonl`);
function recordOwnWrites(root, taskId, paths, now = /* @__PURE__ */ new Date()) {
  if (!taskId || !paths.length) return 0;
  const lines = paths.map((p) => relative4(resolve(root), resolve(root, p)).split("\\").join("/")).filter((p) => p && !p.startsWith("..")).map((path) => JSON.stringify({
    t: now.toISOString(),
    type: "mutation",
    task_id: taskId,
    path
  }));
  if (!lines.length) return 0;
  try {
    const log = eventLogPath(root, taskId);
    if (!existsSync5(dirname5(log))) mkdirSync4(dirname5(log), { recursive: true });
    appendFileSync(log, lines.join("\n") + "\n");
    return lines.length;
  } catch {
    return 0;
  }
}

// src/pull.ts
var STATE_ORDER = ["Triage", "Todo", "In Progress", "In Review", "Done"];
function scanRecords(root) {
  const dir = join12(root, ".zones", "tasks");
  const records = /* @__PURE__ */ new Map();
  const unreadable = [];
  let names;
  try {
    names = readdirSync3(dir).filter((f) => f.endsWith(".md"));
  } catch {
    return { records, unreadable };
  }
  for (const name of names.sort()) {
    if (name === "README.md" || name === "TEMPLATE.md" || name.startsWith("_")) continue;
    const path = join12(dir, name);
    let head;
    try {
      head = readFileSync10(path, "utf8").slice(0, 2e3);
    } catch {
      unreadable.push(path);
      continue;
    }
    const id = /^id:[ \t]*(.+)$/m.exec(head)?.[1]?.trim();
    if (!id) {
      unreadable.push(path);
      continue;
    }
    records.set(id, {
      id,
      title: /^title:[ \t]*(.+)$/m.exec(head)?.[1]?.trim() ?? "",
      state: /^state:[ \t]*(.+)$/m.exec(head)?.[1]?.trim() ?? "",
      path
    });
  }
  return { records, unreadable };
}
function normalise(title) {
  let t = title.trim();
  if (t.startsWith('"') && t.endsWith('"') || t.startsWith("'") && t.endsWith("'")) t = t.slice(1, -1);
  return t.replace(/\\(["'])/g, "$1").replace(/\s+/g, " ").trim().toLowerCase();
}
var NOISE = /* @__PURE__ */ new Set(["the", "and", "that", "with", "for", "from", "its", "has", "had", "was", "not", "one", "this", "but", "are", "you", "can", "all", "which", "what", "when", "where", "into", "out", "off"]);
function sameSubject(a, b) {
  const words = (s) => new Set(normalise(s).split(/[^a-z0-9]+/).filter((w) => w.length > 2 && !NOISE.has(w)));
  const x = words(a);
  const y = words(b);
  if (!x.size || !y.size) return x.size === y.size;
  const [small, large] = x.size <= y.size ? [x, y] : [y, x];
  let shared = 0;
  for (const w of small) if (large.has(w)) shared++;
  return shared / small.size >= 0.5;
}
function collisions(local, board2) {
  const onBoard = new Map(board2.map((t) => [t.id, t.title]));
  const collided = [];
  for (const [id, rec] of local) {
    const theirs = onBoard.get(id);
    if (theirs === void 0) continue;
    if (!sameSubject(rec.title, theirs)) collided.push(id);
  }
  return collided;
}
var taskNum = (id) => Number(/-(\d+)$/.exec(id)?.[1] ?? 0);
function classifyRecords(local, board2) {
  const rank = (s) => STATE_ORDER.indexOf(s);
  const byId = new Map(board2.map((t) => [t.id, t]));
  const out = { behind: [], ahead: [], rewound: [], offLadder: [], unrecorded: [], orphaned: [] };
  for (const [id, rec] of local) {
    const t = byId.get(id);
    if (!t) {
      out.orphaned.push(id);
      continue;
    }
    if (t.state === rec.state) continue;
    const a = rank(rec.state);
    const b = rank(t.state);
    const row = { id, file: rec.state, board: t.state };
    if (a < 0 || b < 0) out.offLadder.push(row);
    else if (a < b) out.behind.push(row);
    else out.ahead.push(row);
  }
  for (const t of board2) {
    if (t.state !== "Triage" && !local.has(t.id)) {
      out.unrecorded.push({ id: t.id, state: t.state, title: t.title });
    }
  }
  for (const list of [out.behind, out.ahead, out.rewound, out.offLadder]) list.sort((x, y) => taskNum(x.id) - taskNum(y.id));
  out.unrecorded.sort((x, y) => taskNum(x.id) - taskNum(y.id));
  out.orphaned.sort((x, y) => taskNum(x) - taskNum(y));
  return out;
}
function setRecordState(path, state) {
  const text = readFileSync10(path, "utf8");
  if (!text.startsWith("---\n")) return false;
  const end = text.indexOf("\n---", 4);
  if (end < 0) return false;
  const head = text.slice(0, end);
  const rest = text.slice(end);
  const next = head.replace(/^state:[ \t]*.*$/m, `state: ${state}`);
  if (next === head) return false;
  writeFileSync7(path, next + rest);
  return true;
}
function renderRecord(t, today, by) {
  const list = (v) => {
    if (Array.isArray(v)) return v.filter((x) => typeof x === "string");
    if (typeof v === "string" && v.trim()) {
      try {
        const parsed = JSON.parse(v);
        if (Array.isArray(parsed)) return parsed.filter((x) => typeof x === "string");
      } catch {
      }
      return [v];
    }
    return [];
  };
  const zones = list(t.affected_zones);
  const criteria = list(t.acceptance_criteria);
  const created = (t.created_at ?? "").slice(0, 10) || today;
  return [
    "---",
    `id: ${t.id}`,
    `title: ${JSON.stringify(t.title)}`,
    `state: ${t.state}`,
    "plan_task: \u2014",
    `owner: ${t.owner || t.requested_by || "unknown"}`,
    `mode: ${t.mode || "standard"}`,
    `branch: ${t.branch || "null"}`,
    "time_box: null",
    `quality_gate: ${t.quality_gate || "none"}`,
    `created: ${created}`,
    "---",
    "",
    `# ${t.id} \xB7 ${t.title}`,
    "",
    `> **Materialised from the board by ${by} on ${today}.**`,
    `> This task reached **${t.state}** without a record file \u2014 the board held it`,
    "> and disk did not, so nothing on disk could audit it. Every field below is",
    "> the board's own; nothing here was reconstructed. There is no Result",
    "> section because no close ever wrote one (CC-156).",
    "",
    "## Goal",
    "",
    t.goal?.trim() || "_The board holds none._",
    "",
    "## Non-goals",
    "",
    t.non_goals?.trim() || "_The board holds none._",
    "",
    "## Affected zones",
    "",
    zones.length ? zones.map((z) => `- ${z}`).join("\n") : "none declared on the board",
    "",
    "## Acceptance criteria",
    "",
    ...criteria.length ? criteria.map((c) => `- [ ] ${c}`) : ["_The board holds none._"],
    "",
    "---",
    "",
    "## History",
    "",
    "| When | State | Note |",
    "|---|---|---|",
    `| ${created} | Triage | Filed on the board |`,
    `| ${today} | ${t.state} | Record materialised from the board; the transitions between these two rows are in the board's events, not here |`,
    ""
  ].join("\n");
}
function statesSeen(events) {
  const known = /* @__PURE__ */ new Set([...STATE_ORDER, "Canceled"]);
  const seen = /* @__PURE__ */ new Set();
  for (const e of events) {
    for (const m of (e.reason ?? "").matchAll(/([A-Za-z][A-Za-z ]*?)\s*→\s*([A-Za-z][A-Za-z ]*)/g)) {
      for (const side of [m[1], m[2]]) {
        const v = side.trim();
        if (known.has(v)) seen.add(v);
      }
    }
  }
  return seen;
}
async function runPull(input) {
  const log = input.log ?? (() => {
  });
  const doFetch = input.fetchImpl ?? fetch;
  const empty = { behind: [], ahead: [], rewound: [], offLadder: [], unrecorded: [], orphaned: [] };
  let res;
  try {
    res = await doFetch(
      `${input.apiUrl.replace(/\/+$/, "")}/v1/${input.tenant}/${input.repo}/tasks`,
      { headers: boardHeaders(input.token) }
    );
  } catch {
    log("  the board is unreachable \u2014 nothing was read and nothing was written");
    return { ...empty, status: "unavailable", adopted: [], written: [], unreadable: [], contested: [] };
  }
  const drift = replyDrift(res);
  if (drift) log(`  note: ${drift}`);
  if (res.status === 401 || res.status === 403) {
    log("  the board refused this session \u2014 run `cycle login`. Nothing was written.");
    return { ...empty, status: "unauthorized", adopted: [], written: [], unreadable: [], contested: [] };
  }
  if (!res.ok) {
    log(`  the board answered ${res.status} \u2014 nothing was written`);
    return { ...empty, status: "unavailable", adopted: [], written: [], unreadable: [], contested: [] };
  }
  const board2 = (await res.json()).tasks;
  const { records: local, unreadable } = scanRecords(input.root);
  const c = classifyRecords(local, board2);
  for (const path of unreadable) {
    log(`  ${path}: no \`id:\` in its frontmatter \u2014 nothing here can tell which task it belongs to`);
  }
  const contestedIds = new Set(collisions(local, board2));
  const contested = [];
  const sieve = (rows) => rows.filter((row) => {
    if (!contestedIds.has(row.id)) return true;
    contested.push(row);
    log(`  ${row.id}: record says ${row.file}, board says ${row.board} \u2014 but the file and the board describe different work under this id; not touched. \`cycle doctor\` says how to decide which record is real.`);
    return false;
  });
  c.behind = sieve(c.behind);
  c.ahead = sieve(c.ahead);
  contested.sort((x, y) => taskNum(x.id) - taskNum(y.id));
  const adopted = [];
  for (const row of c.behind) {
    const rec = local.get(row.id);
    if (!input.adopt) {
      log(`  ${row.id}: record says ${row.file}, board says ${row.board} \u2014 stale record`);
      continue;
    }
    if (setRecordState(rec.path, row.board)) {
      adopted.push(row.id);
      log(`  ${row.id}: ${row.file} \u2192 ${row.board}`);
    } else {
      log(`  ${row.id}: could not rewrite ${rec.path} \u2014 left alone`);
    }
  }
  const stillAhead = [];
  for (const row of c.ahead) {
    let seen;
    try {
      const r = await doFetch(
        `${input.apiUrl.replace(/\/+$/, "")}/v1/${input.tenant}/${input.repo}/tasks/${row.id}/events`,
        { headers: boardHeaders(input.token) }
      );
      if (!r.ok) throw new Error(String(r.status));
      seen = statesSeen((await r.json()).events);
    } catch {
      stillAhead.push(row);
      log(`  ${row.id}: record says ${row.file}, board says ${row.board} \u2014 could not read its events; not touched`);
      continue;
    }
    if (!seen.has(row.file)) {
      stillAhead.push(row);
      log(`  ${row.id}: record says ${row.file}, board says ${row.board} \u2014 the board has never been in ${row.file}; not touched`);
      continue;
    }
    c.rewound.push(row);
    const rec = local.get(row.id);
    if (!input.adopt) {
      log(`  ${row.id}: record says ${row.file}, board moved back to ${row.board} \u2014 stale record`);
    } else if (setRecordState(rec.path, row.board)) {
      adopted.push(row.id);
      log(`  ${row.id}: ${row.file} \u2192 ${row.board} (the board moved back)`);
    } else {
      log(`  ${row.id}: could not rewrite ${rec.path} \u2014 left alone`);
    }
  }
  c.ahead = stillAhead;
  for (const row of c.offLadder) {
    log(`  ${row.id}: record says ${row.file}, board says ${row.board} \u2014 one side is Canceled; not touched`);
  }
  const byId = new Map(board2.map((t) => [t.id, t]));
  const written = [];
  const today = input.today ?? (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
  const frozen = Boolean(input.writeMissing) && unreadable.length > 0;
  if (frozen) {
    log(`  nothing was materialised: ${unreadable.length} file(s) in .zones/tasks/ carry no \`id:\`, and any of them could be a record a new file would fork`);
  }
  for (const t of c.unrecorded) {
    if (!input.writeMissing || frozen) {
      log(`  ${t.id}: ${t.state} on the board with no record file \u2014 ${t.title.slice(0, 60)}`);
      continue;
    }
    const path = join12(input.root, ".zones", "tasks", `${t.id}.md`);
    if (existsSync6(path)) continue;
    mkdirSync5(dirname6(path), { recursive: true });
    writeFileSync7(path, renderRecord(byId.get(t.id), today, "`cycle pull --write-missing`"));
    written.push(t.id);
    log(`  ${t.id}: record written from the board \u2014 ${t.state}`);
  }
  for (const id of c.orphaned) {
    log(`  ${id}: a record file for a task this board has never held`);
  }
  recordOwnWrites(input.root, taskOnBranch(input.root), [
    ...adopted.map((id) => local.get(id).path),
    ...written.map((id) => join12(".zones", "tasks", `${id}.md`))
  ]);
  return { ...c, status: "ok", adopted, written, unreadable, contested };
}

// src/reconcile.ts
import { execFileSync as execFileSync5 } from "node:child_process";
import { existsSync as existsSync8, mkdirSync as mkdirSync6, readdirSync as readdirSync4, readFileSync as readFileSync11, rmSync as rmSync3, writeFileSync as writeFileSync8 } from "node:fs";
import { dirname as dirname7, join as join13 } from "node:path";

// src/worktrees.ts
import { execFileSync as execFileSync4 } from "node:child_process";
import { existsSync as existsSync7, realpathSync } from "node:fs";
function listWorktrees(root) {
  const out = execFileSync4("git", ["worktree", "list", "--porcelain"], {
    cwd: root,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"]
  });
  const found = [];
  let current = null;
  for (const raw of out.split("\n")) {
    const line = raw.trimEnd();
    const space = line.indexOf(" ");
    const key = space === -1 ? line : line.slice(0, space);
    const value = space === -1 ? "" : line.slice(space + 1);
    if (key === "worktree") {
      current = { path: value, branch: null, prunable: false, bare: false };
      found.push(current);
    } else if (!current) {
      continue;
    } else if (key === "branch") {
      current.branch = value.replace(/^refs\/heads\//, "");
    } else if (key === "prunable") {
      current.prunable = true;
    } else if (key === "bare") {
      current.bare = true;
    }
  }
  return found;
}
var resolved = (p) => {
  try {
    return realpathSync(p);
  } catch {
    return p;
  }
};
function otherCheckoutHolding(root, taskId) {
  for (const wt of listWorktrees(root)) {
    if (wt.bare || !wt.branch) continue;
    if (taskIdFrom(wt.branch) !== taskId) continue;
    if (wt.prunable || !existsSync7(wt.path)) continue;
    if (resolved(wt.path) === resolved(root)) continue;
    return wt.path;
  }
  return null;
}
function holderLiveness(root, holderPath) {
  const target = resolved(holderPath);
  for (const wt of listWorktrees(root)) {
    if (resolved(wt.path) !== target) continue;
    return wt.prunable || !existsSync7(wt.path) ? "stale" : "live";
  }
  return "stale";
}

// src/reconcile.ts
function branchExists(root, branch) {
  if (!branch) return false;
  for (const ref of [branch, `origin/${branch}`]) {
    try {
      execFileSync5("git", ["-C", root, "rev-parse", "--verify", "-q", ref], { stdio: "ignore" });
      return true;
    } catch {
    }
  }
  return false;
}
function grantFiles(root) {
  try {
    return readdirSync4(join13(root, ".zones", "state", "grants")).filter((f) => f.endsWith(".json")).map((f) => f.slice(0, -5));
  } catch {
    return [];
  }
}
function liveGrant(root, taskId, now) {
  const path = join13(root, ".zones", "state", "grants", `${taskId}.json`);
  if (!existsSync8(path)) return false;
  try {
    return resolveGrant(JSON.parse(readFileSync11(path, "utf8")), now).state === "active";
  } catch {
    return false;
  }
}
var NOTHING = { adopted: [], written: [], grantsRemoved: [], collided: [] };
async function runReconcile(input) {
  const log = input.log ?? (() => {
  });
  const warn = input.warn ?? (() => {
  });
  const doFetch = input.fetchImpl ?? fetch;
  const now = input.now ?? /* @__PURE__ */ new Date();
  let res;
  try {
    res = await doFetch(`${input.base}/tasks`, { headers: input.headers });
  } catch {
    warn("could not read the board's tasks \u2014 nothing was reconciled");
    return { status: "unavailable", ...NOTHING };
  }
  if (!res.ok) {
    warn(`could not read the board's tasks (${res.status}) \u2014 nothing was reconciled`);
    return { status: "unavailable", ...NOTHING };
  }
  const body = await res.json().catch(() => ({}));
  const tasks = body.tasks ?? [];
  const { records: local, unreadable } = scanRecords(input.root);
  if (!tasks.length && !local.size && !unreadable.length) return { status: "skipped", ...NOTHING };
  const collided = collisions(local, tasks);
  if (collided.length) {
    log(`  ${collided.join(", ")} \u2014 the file and the board describe different work under this id. Nothing was reconciled on this run.`);
    warn("a repair under a colliding id could rewrite the wrong file (D-49), so every repair was skipped. `cycle doctor` says which record is which.");
    return { status: "aborted", ...NOTHING, collided };
  }
  const c = classifyRecords(local, tasks);
  const byId = new Map(tasks.map((t) => [t.id, t]));
  const adopted = [];
  for (const row of c.behind) {
    const rec = local.get(row.id);
    if (setRecordState(rec.path, row.board)) {
      adopted.push(row.id);
      log(`  ${row.id}: the record caught up to the board, ${row.file} \u2192 ${row.board}`);
    } else {
      log(`  ${row.id}: could not rewrite ${rec.path} \u2014 left alone`);
    }
  }
  const written = [];
  if (unreadable.length) {
    log(`  ${unreadable.length} file(s) in .zones/tasks/ carry no \`id:\` \u2014 nothing here can tell which task they belong to. Rename with a leading \`_\` if it is a note rather than a record.`);
  } else {
    const today = input.today ?? (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
    for (const t of c.unrecorded) {
      try {
        if (otherCheckoutHolding(input.root, t.id)) continue;
      } catch {
        continue;
      }
      const path = join13(input.root, ".zones", "tasks", `${t.id}.md`);
      if (existsSync8(path)) continue;
      mkdirSync6(dirname7(path), { recursive: true });
      writeFileSync8(path, renderRecord(byId.get(t.id), today, "`cycle sync`"));
      written.push(t.id);
      log(`  ${t.id}: record written from the board \u2014 ${t.state}`);
    }
  }
  const grantsRemoved = [];
  for (const id of grantFiles(input.root)) {
    if (id === input.taskId) continue;
    const t = byId.get(id);
    if (!t || t.state === "In Progress") continue;
    rmSync3(join13(input.root, ".zones", "state", "grants", `${id}.json`), { force: true });
    grantsRemoved.push(id);
    log(`  removed the stranded grant for ${id} \u2014 the board has it in ${t.state}, not In Progress`);
  }
  if (c.ahead.length) {
    log(`  ${c.ahead.length} record(s) claim a state the board does not \u2014 \`cycle pull\` reads their events and says which ones it can account for`);
  }
  const running = tasks.filter((t) => t.state === "In Progress");
  const dead = running.filter((t) => !branchExists(input.root, t.branch) || !liveGrant(input.root, t.id, now));
  if (dead.length) {
    log(`  ${dead.length} task(s) are In Progress on the board with nothing running here: ${dead.slice(0, 6).map((t) => t.id).join(", ")}${dead.length > 6 ? ", \u2026" : ""}`);
    log('    Not repaired here: a pause is a state change and needs your reason \u2014 `cycle pause <task> --reason "..."`');
  }
  recordOwnWrites(input.root, input.taskId, [
    ...adopted.map((id) => local.get(id).path),
    ...written.map((id) => join13(".zones", "tasks", `${id}.md`))
  ]);
  return { status: "ran", adopted, written, grantsRemoved, collided: [] };
}

// src/update-notice.ts
import { existsSync as existsSync9, mkdirSync as mkdirSync7, readFileSync as readFileSync12, writeFileSync as writeFileSync9 } from "node:fs";
import { homedir as homedir3 } from "node:os";
import { dirname as dirname8, join as join14 } from "node:path";
var CLI_VERSION = "0.1.12";
var CHECK_TTL_MS = 24 * 60 * 60 * 1e3;
var updateCachePath = () => join14(homedir3(), ".commitcycle", "update-check.json");
function isBehind(current, latest) {
  const cur = numericParts(current);
  const lat = numericParts(latest);
  if (!cur || !lat) return false;
  const n = Math.max(cur.length, lat.length);
  for (let i = 0; i < n; i++) {
    const a = cur[i] ?? 0;
    const b = lat[i] ?? 0;
    if (b > a) return true;
    if (b < a) return false;
  }
  return false;
}
function updateLine(latest) {
  return `CommitCycle ${latest} is available \u2014 npm i -g commitcycle / /plugin update`;
}
async function fetchLatest(apiUrl, fetchImpl = fetch, timeoutMs = 1500) {
  const url = `${apiUrl.replace(/\/+$/, "")}/health`;
  const ac = new AbortController();
  const timer = setTimeout(() => ac.abort(), timeoutMs);
  try {
    const res = await fetchImpl(url, { headers: boardHeaders(), signal: ac.signal });
    if (!res.ok) return void 0;
    const body = await res.json().catch(() => ({}));
    return typeof body.latest === "string" && body.latest ? body.latest : void 0;
  } catch {
    return void 0;
  } finally {
    clearTimeout(timer);
  }
}
function dueForCheck(cachePath, now, ttlMs = CHECK_TTL_MS) {
  try {
    if (!existsSync9(cachePath)) return true;
    const raw = JSON.parse(readFileSync12(cachePath, "utf8"));
    const last = typeof raw.last_check === "string" ? Date.parse(raw.last_check) : NaN;
    if (Number.isNaN(last)) return true;
    return now.getTime() - last >= ttlMs;
  } catch {
    return true;
  }
}
function recordCheck(cachePath, now) {
  try {
    mkdirSync7(dirname8(cachePath), { recursive: true });
    writeFileSync9(cachePath, `${JSON.stringify({ last_check: now.toISOString() }, null, 2)}
`);
  } catch {
  }
}
function ambientNoticeAllowed(opts) {
  if (opts.code !== 0) return false;
  if (!opts.stderrIsTTY) return false;
  if (!opts.command || opts.command === "doctor") return false;
  return true;
}
async function notifyIfBehind(opts) {
  try {
    const env = opts.env ?? process.env;
    if (env.CC_NO_UPDATE_NOTICE) return;
    const now = opts.now ?? /* @__PURE__ */ new Date();
    const cachePath = opts.cachePath ?? updateCachePath();
    if (!dueForCheck(cachePath, now, opts.ttlMs)) return;
    const latest = await fetchLatest(opts.apiUrl, opts.fetchImpl);
    recordCheck(cachePath, now);
    if (!latest) return;
    const current = opts.current ?? CLI_VERSION;
    if (!isBehind(current, latest)) return;
    (opts.write ?? ((line) => process.stderr.write(line)))(`${updateLine(latest)}
`);
  } catch {
  }
}
function numericParts(v) {
  const segs = v.trim().split(".").map((s) => parseInt(s, 10));
  if (!segs.length || Number.isNaN(segs[0])) return null;
  return segs.map((x) => Number.isNaN(x) ? 0 : x);
}

// src/enforcement-age.ts
import { execFileSync as execFileSync6 } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync as existsSync10, readFileSync as readFileSync13, readdirSync as readdirSync5, statSync as statSync4 } from "node:fs";
import { homedir as homedir4 } from "node:os";
import { dirname as dirname9, join as join15, resolve as resolve2 } from "node:path";
var HOOK_SOURCE = ["packages/hook", "packages/contracts"];
var WORKSPACE_CORE = ["packages", "hook", "dist", "core.js"];
var COMMITTED_CORE = ["plugin", "hook", "dist", "core.js"];
function git(root, args) {
  try {
    return execFileSync6("git", ["-C", root, ...args], { stdio: ["ignore", "pipe", "ignore"] }).toString().trim();
  } catch {
    return null;
  }
}
function isAncestor(root, a, b) {
  try {
    execFileSync6("git", ["-C", root, "merge-base", "--is-ancestor", a, b], { stdio: "ignore" });
    return true;
  } catch (err) {
    const code = err.status;
    return code === 1 ? false : null;
  }
}
function lastCommit(root, paths) {
  const out = git(root, ["log", "-1", "--format=%H%x00%cI", "--", ...paths]);
  if (!out) return null;
  const [rev, when] = out.split("\0");
  if (!rev || !when) return null;
  const at2 = new Date(when);
  return Number.isNaN(at2.getTime()) ? null : { rev, when: at2 };
}
function newestSourceMtime(root) {
  let newest = null;
  const walk = (dir, depth) => {
    if (depth > 8) return;
    for (const entry of safeReaddir(dir)) {
      if (entry === "node_modules" || entry === "dist" || entry.startsWith(".")) continue;
      const full = join15(dir, entry);
      let stat;
      try {
        stat = statSync4(full);
      } catch {
        continue;
      }
      if (stat.isDirectory()) {
        walk(full, depth + 1);
      } else if (!newest || stat.mtime > newest.at) {
        newest = { path: full, at: stat.mtime };
      }
    }
  };
  for (const rel of HOOK_SOURCE) walk(join15(root, rel, "src"), 0);
  return newest;
}
function facts(role, path, via) {
  if (!path || !existsSync10(path)) {
    return { role, path, exists: false, sha256: null, bytes: null, built: null, via };
  }
  try {
    const stat = statSync4(path);
    const bytes = readFileSync13(path);
    return {
      role,
      path,
      exists: true,
      sha256: createHash("sha256").update(bytes).digest("hex"),
      bytes: stat.size,
      built: stat.mtime,
      via
    };
  } catch {
    return { role, path, exists: false, sha256: null, bytes: null, built: null, via };
  }
}
function safeReaddir(dir) {
  try {
    return readdirSync5(dir);
  } catch {
    return [];
  }
}
function pluginBundles(home, pid) {
  const bundles = [];
  const cache = join15(home, ".claude", "plugins", "cache");
  for (const marketplace of safeReaddir(cache)) {
    for (const plugin of safeReaddir(join15(cache, marketplace))) {
      for (const version of safeReaddir(join15(cache, marketplace, plugin))) {
        const root = join15(cache, marketplace, plugin, version);
        const core = join15(root, "hook", "dist", "core.js");
        if (!existsSync10(core)) continue;
        const heldBy = safeReaddir(join15(root, ".in_use")).filter((f) => !f.startsWith("."));
        let startedAt2 = null;
        if (pid && heldBy.includes(pid)) {
          try {
            const held = JSON.parse(readFileSync13(join15(root, ".in_use", pid), "utf8"));
            if (held.procStart) {
              const at2 = new Date(held.procStart);
              if (!Number.isNaN(at2.getTime())) startedAt2 = at2;
            }
          } catch {
          }
        }
        bundles.push({ root, marketplace, plugin, version, core, heldBy, startedAt: startedAt2 });
      }
    }
  }
  return bundles;
}
function fromInUseMarker(home, pid) {
  if (!pid) return null;
  for (const b of pluginBundles(home, pid)) {
    if (!b.heldBy.includes(pid)) continue;
    return {
      path: b.core,
      via: `the harness's own in-use marker for pid ${pid} \u2014 ${b.marketplace}/${b.plugin} ${b.version}`,
      startedAt: b.startedAt
    };
  }
  return null;
}
function fromPath(env) {
  for (const entry of (env.PATH ?? "").split(":")) {
    if (!entry.includes(`${join15("plugins", "cache")}`) || !entry.endsWith(`${join15("x", "bin")}`.slice(1))) continue;
    const core = join15(dirname9(entry), "hook", "dist", "core.js");
    if (existsSync10(core)) {
      return { path: core, via: `a plugin root on PATH (${dirname9(entry)}) \u2014 no session marker, so this is inference`, startedAt: null };
    }
  }
  return null;
}
function fromSettings(root, env) {
  const settingsPath = join15(root, ".claude", "settings.json");
  if (!existsSync10(settingsPath)) return null;
  try {
    const settings = JSON.parse(readFileSync13(settingsPath, "utf8"));
    const cmd = settings?.hooks?.PreToolUse?.[0]?.hooks?.[0]?.command;
    if (!cmd) return null;
    const wrapper = cmd.replace(/\$\{?CLAUDE_PROJECT_DIR\}?/g, root).replace(/\$\{?CLAUDE_PLUGIN_ROOT\}?/g, env.CLAUDE_PLUGIN_ROOT ?? "").trim();
    if (!wrapper) return null;
    return {
      path: resolve2(dirname9(wrapper), "..", "dist", "core.js"),
      via: `.claude/settings.json \u2192 ${cmd}`,
      startedAt: null,
      cmd
    };
  } catch {
    return null;
  }
}
function locateEnforcing(root, env, home) {
  const pinned = env.CC_HOOK_CORE;
  if (pinned) return { path: pinned, via: "CC_HOOK_CORE, set explicitly", startedAt: null };
  const marker = fromInUseMarker(home, env.CLAUDE_PID ?? null);
  if (marker) return marker;
  const declared = env.CLAUDE_PLUGIN_ROOT;
  if (declared) {
    const core = join15(declared, "hook", "dist", "core.js");
    if (existsSync10(core)) return { path: core, via: "CLAUDE_PLUGIN_ROOT", startedAt: null };
  }
  return fromPath(env) ?? fromSettings(root, env) ?? { path: null, via: "nothing on this machine names one", startedAt: null };
}
var DAY = 24 * 60 * 60 * 1e3;
function ageWords(built, now) {
  if (!built) return "age unknown";
  const days = Math.floor((now.getTime() - built.getTime()) / DAY);
  if (days < 0) return "built in the future \u2014 the clock disagrees with itself";
  if (days === 0) return "built today";
  return `${days} day${days === 1 ? "" : "s"} old`;
}
function short(sha) {
  return sha ? sha.slice(0, 12) : "unreadable";
}
function stamp(d) {
  return d ? `${d.toISOString().replace("T", " ").slice(0, 16)}Z` : "unknown";
}
function describe(b, now) {
  if (!b.exists) return `${b.path ?? "nowhere"} \u2014 not there`;
  return `${b.path} \u2014 ${b.bytes} bytes, sha ${short(b.sha256)}, built ${stamp(b.built)} (${ageWords(b.built, now)})`;
}
function inspectEnforcement(root, opts = {}) {
  const env = opts.env ?? process.env;
  const home = opts.home ?? env.HOME ?? homedir4();
  const now = opts.now ?? /* @__PURE__ */ new Date();
  const checks = [];
  const shallow = git(root, ["rev-parse", "--is-shallow-repository"]) === "true";
  const src = lastCommit(root, HOOK_SOURCE);
  const source = { rev: src?.rev ?? null, when: src?.when ?? null, shallow };
  const located = locateEnforcing(root, env, home);
  const enforcing = facts("enforcing", located.path, located.via);
  const workspace = facts("workspace", join15(root, ...WORKSPACE_CORE), "this checkout, built by `pnpm --filter @commitcycle/hook build`");
  const committed = facts("committed", join15(root, ...COMMITTED_CORE), "committed, and what a marketplace install downloads");
  if (!enforcing.path) {
    checks.push({
      name: "enforcing bundle",
      status: "warn",
      detail: "nothing on this machine says which hook bundle is judging this session",
      fix: "Run this from inside the session you want to know about \u2014 the harness sets CLAUDE_PID and stamps the plugin root it pinned. Outside a session there is nothing first-hand to read, and CC_HOOK_CORE=<path> is how to name one by hand."
    });
  } else if (!enforcing.exists) {
    checks.push({
      name: "enforcing bundle",
      status: "fail",
      detail: `${enforcing.path} does not exist, and that is where the wrapper looks (${enforcing.via})`,
      fix: "The wrapper is fail-closed, so this denies every tool call in the session, reads included. Build it (`pnpm --filter @commitcycle/hook build`) or reinstall the plugin \u2014 from a terminal, not from inside the session it is denying."
    });
  } else {
    checks.push({
      name: "enforcing bundle",
      status: "ok",
      detail: `${describe(enforcing, now)} \u2014 found via ${enforcing.via}`
    });
  }
  const onDisk = newestSourceMtime(root);
  const fromGit = source.when ? { at: source.when, said: `the last committed hook source change (${short(source.rev)})` } : null;
  const fromDisk = onDisk ? { at: onDisk.at, said: `the newest file under the hook sources (${onDisk.path.startsWith(root) ? onDisk.path.slice(root.length + 1) : onDisk.path})` } : null;
  const effective = fromGit && fromDisk ? fromDisk.at > fromGit.at ? fromDisk : fromGit : fromGit ?? fromDisk;
  if (!workspace.exists) {
    checks.push({
      name: "built bundle vs source",
      status: "warn",
      detail: `nothing is built at ${join15(...WORKSPACE_CORE)} in this checkout`,
      fix: "A session wired to this checkout would be denied every tool call. Run `pnpm --filter @commitcycle/hook build`. (A linked worktree starts this way \u2014 dist/ is gitignored and is not carried across.)"
    });
  } else if (effective && workspace.built && workspace.built < effective.at) {
    checks.push({
      name: "built bundle vs source",
      status: "fail",
      detail: `built ${stamp(workspace.built)}, which is older than ${effective.said} at ${stamp(effective.at)} \u2014 this build predates the rules it is enforcing`,
      fix: "Run `pnpm --filter @commitcycle/hook build`. Then read the next line: a rebuild does not reach a session that already loaded the old one."
    });
  } else if (!effective) {
    checks.push({
      name: "built bundle vs source",
      status: "warn",
      detail: shallow ? "the clone is shallow, so no commit history can say when the hook source last changed" : "nothing could be read about when the hook source last changed, so the build has nothing to be older than",
      fix: shallow ? "Fetch the history (`fetch-depth: 0` in CI, `git fetch --unshallow` locally). Without it this check cannot tell a fresh bundle from a stale one." : "Check that this is the repository the hook is built from."
    });
  } else {
    checks.push({
      name: "built bundle vs source",
      status: "ok",
      detail: `built ${stamp(workspace.built)}, after ${effective.said} at ${stamp(effective.at)}`
    });
  }
  if (!committed.exists) {
    checks.push({
      name: "shipped bundle vs source",
      status: "warn",
      detail: `${join15(...COMMITTED_CORE)} is missing, so a marketplace install has no hook to run`,
      fix: "Run `sh scripts/package-plugin.sh`. A plugin that claims enforcement and cannot enforce is worse than one that admits it has none."
    });
  } else if (workspace.exists && committed.sha256 === workspace.sha256) {
    checks.push({
      name: "shipped bundle vs source",
      status: "ok",
      detail: `byte-identical to the build in this checkout (sha ${short(committed.sha256)})`
    });
  } else {
    const bundleCommit = lastCommit(root, [join15(...COMMITTED_CORE)]);
    const verdict = source.rev && bundleCommit ? bundleCommit.rev === source.rev ? "same" : isAncestor(root, bundleCommit.rev, source.rev) === true ? "behind" : isAncestor(root, source.rev, bundleCommit.rev) === true ? "ahead" : "unknown" : "unknown";
    if (verdict === "behind") {
      const days = source.when && bundleCommit ? Math.floor((source.when.getTime() - bundleCommit.when.getTime()) / DAY) : null;
      checks.push({
        name: "shipped bundle vs source",
        status: "fail",
        detail: `last rebuilt by ${short(bundleCommit.rev)} on ${stamp(bundleCommit.when)}; the hook source changed after that, at ${short(source.rev)} on ${stamp(source.when)}${days !== null ? ` \u2014 ${days} day(s) of source it does not contain` : ""}`,
        fix: "Everyone who installed the plugin is running the older rules. Rebuild and repackage: `pnpm --filter @commitcycle/hook build && pnpm --filter @commitcycle/cli build && sh scripts/package-plugin.sh`, and commit what it writes."
      });
    } else if (verdict === "unknown") {
      checks.push({
        name: "shipped bundle vs source",
        status: "warn",
        detail: shallow ? "the clone is shallow, so the committed bundle's provenance cannot be read" : "the committed bundle and the hook source have no ancestry between them that git can order",
        fix: shallow ? "Fetch the history (`fetch-depth: 0` in CI). Until then a stale shipped bundle passes here unnoticed, which is the failure this check exists for." : "Rebuild and repackage rather than reason about it: `pnpm -r build && sh scripts/package-plugin.sh`."
      });
    } else if (!workspace.exists) {
      checks.push({
        name: "shipped bundle vs source",
        status: "ok",
        detail: `last rebuilt by ${short(bundleCommit?.rev ?? null)} on ${stamp(bundleCommit?.when ?? null)}, at or after the last hook source change (${short(source.rev)}, ${stamp(source.when)}) \u2014 nothing is built here to compare the bytes against`
      });
    } else {
      checks.push({
        name: "shipped bundle vs source",
        status: "warn",
        detail: `provenance says it is current (${short(bundleCommit?.rev ?? null)}, ${stamp(bundleCommit?.when ?? null)}), but it is not byte-identical to the build in this checkout (${short(committed.sha256)} vs ${short(workspace.sha256)})`,
        fix: "Either this checkout's build is stale, or the bundle does not rebuild byte-for-byte here. Rebuild and repackage before cutting a release, and if the bytes still differ say so in the release note rather than guessing."
      });
    }
  }
  const reference = workspace.exists ? workspace : committed;
  if (!enforcing.exists || !enforcing.sha256) {
  } else if (!reference.exists || !reference.sha256) {
    checks.push({
      name: "session vs bundle",
      status: "warn",
      detail: "nothing is built in this checkout to compare the running session against",
      fix: "Run `pnpm --filter @commitcycle/hook build`, then re-run this. Until then, the age of what is enforcing you is measurable and its correctness is not."
    });
  } else if (enforcing.sha256 === reference.sha256) {
    checks.push({
      name: "session vs bundle",
      status: "ok",
      detail: `this session is running the same artifact this checkout produces (sha ${short(enforcing.sha256)})`
    });
  } else {
    const older = enforcing.built && reference.built && enforcing.built < reference.built;
    const gap = enforcing.built && reference.built ? Math.abs(Math.floor((reference.built.getTime() - enforcing.built.getTime()) / DAY)) : null;
    const repoAgrees = committed.exists && workspace.exists && committed.sha256 === workspace.sha256;
    checks.push({
      name: "session vs bundle",
      status: "fail",
      detail: `the session is enforced by ${enforcing.path} (sha ${short(enforcing.sha256)}, built ${stamp(enforcing.built)}), which is ${older ? "older" : "a different artifact"} than what this checkout produces at ${reference.path} (sha ${short(reference.sha256)}, built ${stamp(reference.built)})${gap !== null && gap > 0 ? ` \u2014 ${gap} day(s) apart` : ""}` + (repoAgrees ? ". The repository agrees with itself \u2014 the drift is between it and what this session loaded" : ""),
      fix: "Rebuilding will NOT fix this: the harness pinned that copy" + (located.startedAt ? ` when the session started at ${stamp(located.startedAt)}` : " when the session started") + ", and it is outside this repository. Restart the session \u2014 for a plugin install, reinstall or update the plugin first \u2014 and re-run this to confirm. Until then nothing you build here is enforcing anything, and every green test is green about code that is not running."
    });
  }
  const pid = env.CLAUDE_PID ?? null;
  const plugins = pluginBundles(home, pid);
  const pinned = (pid ? plugins.find((b) => b.heldBy.includes(pid)) : null) ?? null;
  const settingsLoc = fromSettings(root, env);
  const repoReg = settingsLoc?.path && settingsLoc.cmd ? { command: settingsLoc.cmd, core: settingsLoc.path, exists: existsSync10(settingsLoc.path) } : null;
  const registrations = { repo: repoReg, plugins, pinned };
  const registrationChecks = [];
  if (repoReg?.exists && plugins.length) {
    const plug = pinned ?? [...plugins].sort((a, b) => compareVersions(b.version, a.version))[0];
    const repoF = facts("workspace", repoReg.core, "registered by .claude/settings.json");
    const plugF = facts("enforcing", plug.core, "the installed plugin");
    if (repoF.sha256 && plugF.sha256) {
      const keepOne = "Keep one: remove the PreToolUse entry from .claude/settings.json and let the plugin enforce, or `/plugin uninstall` and let the checkout enforce. Whichever you keep, restart the session \u2014 the pin is taken at start and a change here does not reach it.";
      if (repoF.sha256 === plugF.sha256) {
        registrationChecks.push({
          name: "one hook, not two",
          status: "ok",
          detail: `two registrations are live and they are the same artifact (sha ${short(repoF.sha256)}): this repository's ${repoReg.command}, and the installed plugin ${plug.marketplace}/${plug.plugin} ${plug.version}`
        });
      } else {
        registrationChecks.push({
          name: "one hook, not two",
          status: "fail",
          detail: `two different hook bundles are registered for this repository at once \u2014 this checkout's ${repoReg.core} (sha ${short(repoF.sha256)}, built ${stamp(repoF.built)}, ${ageWords(repoF.built, now)}) via ${repoReg.command}, and the installed plugin ${plug.marketplace}/${plug.plugin} ${plug.version} at ${plug.core} (sha ${short(plugF.sha256)}, built ${stamp(plugF.built)}, ${ageWords(plugF.built, now)}). ` + (pinned ? `The harness pinned the plugin's for this session \u2014 that is the one deciding.` : `Nothing on this machine says which one this session pinned, so which set of rules is deciding is unknown.`),
          fix: pinned ? `The plugin's copy answers every tool call in this session, so nothing you build in this checkout changes what is enforced \u2014 the same trap as the session/bundle line above, with a second registration rather than a second vintage. ${keepOne}` : `Run this from inside the session you want to know about (the harness sets CLAUDE_PID and stamps the plugin root it pinned). ${keepOne}`
        });
      }
    }
  }
  return {
    source,
    enforcing,
    workspace,
    committed,
    session: { pid: env.CLAUDE_PID ?? null, startedAt: located.startedAt },
    checks,
    registrations,
    registrationChecks
  };
}
function compareVersions(a, b) {
  const parse = (v) => v.split(".").map((s) => {
    const n = Number.parseInt(s, 10);
    return Number.isNaN(n) ? 0 : n;
  });
  const x = parse(a);
  const y = parse(b);
  for (let i = 0; i < Math.max(x.length, y.length); i++) {
    const d = (x[i] ?? 0) - (y[i] ?? 0);
    if (d) return d;
  }
  return 0;
}
function enforcementChecks(root, opts = {}) {
  try {
    return inspectEnforcement(root, opts).checks;
  } catch (err) {
    return [{
      name: "enforcing bundle",
      status: "warn",
      detail: `the age of the enforcing bundle could not be measured: ${err.message}`,
      fix: "Report this \u2014 an unmeasurable guard is the state this check exists to make visible."
    }];
  }
}
function enforcementReport(root, opts = {}) {
  try {
    return inspectEnforcement(root, opts);
  } catch {
    return null;
  }
}

// src/doctor.ts
async function handshakeCheck(apiUrl, fetchImpl = fetch) {
  const url = `${apiUrl.replace(/\/+$/, "")}/health`;
  try {
    const res = await fetchImpl(url, { headers: boardHeaders() });
    if (!res.ok) {
      return {
        name: "version handshake",
        status: "warn",
        detail: `the board answered ${res.status} to /health`,
        fix: "The server is up but unwell \u2014 read its logs before trusting any refusal it makes."
      };
    }
    const drift = replyDrift(res);
    if (drift) {
      return {
        name: "version handshake",
        status: "warn",
        detail: drift,
        fix: "Two builds are talking past each other. Align them before debugging anything they disagree on."
      };
    }
    const body = await res.json().catch(() => ({}));
    return {
      name: "version handshake",
      status: "ok",
      detail: `CLI and server both speak cc-protocol ${PROTOCOL_VERSION}` + (body.started_at ? ` \u2014 server up since ${body.started_at}` : "")
    };
  } catch {
    return {
      name: "version handshake",
      status: "warn",
      detail: `no answer from ${url}`,
      fix: "Start the board, or fix the address. Board commands will fail until it answers."
    };
  }
}
async function updateCheck(apiUrl, current = CLI_VERSION, fetchImpl = fetch) {
  const latest = await fetchLatest(apiUrl, fetchImpl);
  if (!latest) {
    return {
      name: "up to date",
      status: "ok",
      detail: `this CLI is ${current}; the board did not report a latest version, so an update cannot be checked from here`
    };
  }
  if (isBehind(current, latest)) {
    return {
      name: "up to date",
      status: "warn",
      detail: `the board's latest is ${latest} and this CLI is ${current}`,
      fix: `Update when it suits \u2014 nothing here is blocked by it: ${updateLine(latest)}.`
    };
  }
  return {
    name: "up to date",
    status: "ok",
    detail: `on the latest \u2014 this CLI is ${current} and the board reports ${latest}`
  };
}
async function recordDriftCheck(root, board2, fetchImpl = fetch, now = /* @__PURE__ */ new Date()) {
  const { records: local, unreadable } = scanRecords(root);
  if (!local.size && !unreadable.length) return [];
  let tasks;
  try {
    const res = await fetchImpl(
      `${board2.apiUrl.replace(/\/+$/, "")}/v1/${board2.tenant}/${board2.repo}/tasks`,
      { headers: boardHeaders(board2.token) }
    );
    if (!res.ok) {
      return [{
        name: "records match the board",
        status: "warn",
        detail: `the board answered ${res.status} \u2014 ${local.size} record file(s) went unchecked`,
        fix: res.status === 401 ? "Run `cycle login`. Until the board answers, nothing here can tell a stale record from a correct one." : "Read the board's logs. An unreadable board cannot confirm that the files on disk describe real work."
      }];
    }
    tasks = (await res.json()).tasks;
  } catch {
    return [{
      name: "records match the board",
      status: "warn",
      detail: `no answer from ${board2.apiUrl} \u2014 ${local.size} record file(s) went unchecked`,
      fix: "Start the board, or fix the address."
    }];
  }
  const onBoard = new Map(tasks.map((t) => [t.id, t.title]));
  const collided = [];
  const reworded = [];
  for (const [id, rec] of local) {
    const theirs = onBoard.get(id);
    if (theirs === void 0) continue;
    if (sameSubject(rec.title, theirs)) {
      if (normalise(rec.title) !== normalise(theirs)) reworded.push(id);
    } else collided.push(id);
  }
  const states = classifyRecords(local, tasks);
  const orphaned = states.orphaned;
  const checks = [];
  if (collided.length) {
    checks.push({
      name: "records match the board",
      status: "fail",
      detail: `${collided.join(", ")} \u2014 the file and the board describe different work under this id`,
      fix: "Do not close either until you know which record is the real one: read the file's history table against the board's events, then refile the loser under an id the board issues. If the file is the older of the two, its evidence may already have been overwritten \u2014 check `git log` for that path."
    });
  }
  if (reworded.length) {
    checks.push({
      name: "record titles drift",
      status: "warn",
      detail: `${reworded.length} record(s) are worded differently on the board: ${reworded.slice(0, 8).join(", ")}${reworded.length > 8 ? ", \u2026" : ""}`,
      fix: 'Same work, two names. Harmless until something resolves a task by its title \u2014 push the file\'s wording with `cycle scope <id> --title "\u2026"`, one per listed id, or edit the board to match. `cycle sync` will not do it: title wording is not a drift class it reconciles.'
    });
  }
  if (states.behind.length) {
    checks.push({
      name: "record state is stale",
      status: "warn",
      detail: `${states.behind.length} record(s) are behind the board: ${states.behind.slice(0, 6).map((r) => `${r.id} ${r.file}\u2192${r.board}`).join(", ")}${states.behind.length > 6 ? ", \u2026" : ""}`,
      fix: "Run `cycle pull --adopt`. A record that disagrees with the board is the record being stale, not a second source of truth."
    });
  }
  if (states.ahead.length) {
    checks.push({
      name: "ahead of the board",
      status: "warn",
      detail: `${states.ahead.length} record(s) claim a state the board does not: ${states.ahead.slice(0, 6).map((r) => `${r.id} ${r.file} vs ${r.board}`).join(", ")}${states.ahead.length > 6 ? ", \u2026" : ""}`,
      // This check reads state only. `cycle pull` reads the events too, which is
      // what separates "the board moved back" (a pause — stale record) from
      // "the board never saw this" (evidence). Sending you there beats
      // guessing here or fetching every task's log on every doctor run.
      fix: "Run `cycle pull` \u2014 it reads each one's events and says which the board can account for. The ones it cannot are evidence, not staleness: walk them through the gate, or record why they cannot be. Until then the gate reads the board's answer, not the file's."
    });
  }
  if (states.unrecorded.length) {
    checks.push({
      name: "work with no record",
      status: "warn",
      detail: `${states.unrecorded.length} task(s) are past Triage on the board with no record file: ${states.unrecorded.slice(0, 6).map((t) => `${t.id} (${t.state})`).join(", ")}${states.unrecorded.length > 6 ? ", \u2026" : ""}`,
      fix: "Board-born and never materialised \u2014 there is nothing on disk to audit them by. Write a record, or cancel the row."
    });
  }
  const running = tasks.filter((t) => t.state === "In Progress");
  const notRunning = running.filter((t) => !branchExists(root, t.branch) || !liveGrant(root, t.id, now));
  if (notRunning.length) {
    checks.push({
      name: "In Progress is running",
      status: "warn",
      detail: `${notRunning.length} of ${running.length} In Progress task(s) have no branch in git or no live grant: ` + notRunning.slice(0, 6).map((t) => t.id).join(", ") + (notRunning.length > 6 ? ", \u2026" : ""),
      fix: 'Nothing is running under these. `cycle pause <task> --reason "..."` puts them back in Todo and hands the grant back; access is re-earned at the gate when the work actually starts.'
    });
  }
  const stranded = grantFiles(root).filter((id) => !running.some((t) => t.id === id));
  if (stranded.length) {
    checks.push({
      name: "stranded grants",
      status: "warn",
      detail: `${stranded.length} grant file(s) for tasks the board does not have In Progress: ${stranded.slice(0, 8).join(", ")}${stranded.length > 8 ? ", \u2026" : ""}`,
      fix: "Delete them: .zones/state/grants/<task>.json. The hook reads these files and never the board (D-10), so a leftover one is local access to a protected zone that nothing upstream believes in."
    });
  }
  if (unreadable.length) {
    checks.push({
      name: "unreadable record",
      status: "warn",
      detail: `${unreadable.length} file(s) in .zones/tasks/ carry no \`id:\`: ${unreadable.map((p) => p.split("/").pop()).slice(0, 4).join(", ")}`,
      fix: "Nothing that walks this directory can tell which task they belong to, so every check above skipped them. CC-142 was an audit record misfiled here with `task:` instead of `id:`. Give it an id, move it where it belongs \u2014 or, if it is a note rather than a record, rename it with a leading `_` and this directory will stop trying to read it."
    });
  }
  if (orphaned.length) {
    checks.push({
      name: "records match the board",
      status: "warn",
      detail: `${orphaned.length} record file(s) name a task this board has never heard of: ${orphaned.slice(0, 6).join(", ")}${orphaned.length > 6 ? ", \u2026" : ""}`,
      fix: "Either they were filed against a different board, or this board is not the one this repository reports to. Check `cycle doctor`'s board scope line before assuming the files are wrong."
    });
  }
  if (!collided.length && !orphaned.length) {
    checks.push({
      name: "records match the board",
      status: "ok",
      detail: `${local.size} record file(s) name the work the board holds`
    });
  }
  return checks;
}
var DEPLOY_TOOLS = /\b(wrangler\s+(deploy|versions\s+deploy|pages\s+deploy)|vercel\s+(deploy|--prod)|netlify\s+deploy|firebase\s+deploy|fly(ctl)?\s+deploy|sst\s+deploy|serverless\s+deploy|eb\s+deploy|gcloud\s+run\s+deploy)\b/;
var GUARD_CALL = /\bguard-deploy\b|\bdeploy-guard\b/;
var SCRIPT_REF = /(?:^|[\s&|;(<>"'`])((?:\.{0,2}\/)?(?:[\w.@-]+\/)+[\w.@-]+\.(?:sh|bash|mjs|cjs|js|ts))(?=$|[\s&|;)<>"'`])/g;
function reachesGuard(root, manifestRel, body) {
  if (GUARD_CALL.test(body)) return "guarded";
  const top = resolve3(root);
  const bases = [dirname10(join16(top, manifestRel)), top];
  let unread = false;
  for (const match of body.matchAll(SCRIPT_REF)) {
    const ref = match[1];
    let read = false;
    for (const base of bases) {
      const candidate = resolve3(base, ref);
      if (candidate !== top && !candidate.startsWith(top + sep)) continue;
      let stat;
      try {
        stat = statSync5(candidate);
      } catch {
        continue;
      }
      if (!stat.isFile() || stat.size > 256 * 1024) continue;
      let script;
      try {
        script = readFileSync14(candidate, "utf8");
      } catch {
        continue;
      }
      read = true;
      const runnable = script.split("\n").filter((l) => !/^\s*#/.test(l)).join("\n");
      if (GUARD_CALL.test(runnable)) return "guarded";
      break;
    }
    if (!read) unread = true;
  }
  return unread ? "unreadable" : "unguarded";
}
function manifestPaths(root) {
  const rels = ["package.json"];
  for (const group of ["apps", "packages", "services"]) {
    let entries;
    try {
      entries = readdirSync6(join16(root, group));
    } catch {
      continue;
    }
    for (const entry of entries.sort()) {
      if (entry.startsWith(".")) continue;
      rels.push(`${group}/${entry}/package.json`);
    }
  }
  return rels;
}
function deployChecks(root) {
  const unguarded = [];
  const unreadable = [];
  let looked = false;
  for (const rel of manifestPaths(root)) {
    const file = join16(root, rel);
    if (!existsSync11(file)) continue;
    try {
      const scripts = JSON.parse(readFileSync14(file, "utf8")).scripts ?? {};
      looked = true;
      for (const [name, body] of Object.entries(scripts)) {
        if (!DEPLOY_TOOLS.test(body)) continue;
        const verdict = reachesGuard(root, rel, body);
        if (verdict === "guarded") continue;
        (verdict === "unreadable" ? unreadable : unguarded).push(`${rel === "package.json" ? "" : `${rel} `}${name}`);
      }
    } catch {
    }
  }
  if (!looked) return [];
  const checks = [];
  if (unguarded.length) {
    checks.push({
      name: "deploy guard",
      status: "warn",
      detail: `${unguarded.length} deploy script(s) can publish from any branch: ${unguarded.join(", ")}`,
      fix: 'Most hosts build every branch into the same place by default, so a push to a feature branch becomes a production deploy. Put the guard in front: "deploy": "cycle guard-deploy && <your deploy command>". It exits 2 and deploys nothing when the branch is not your trunk, and CC_ALLOW_BRANCH_DEPLOY=1 is the way to mean it on purpose.'
    });
  }
  if (unreadable.length) {
    checks.push({
      name: "deploy guard",
      status: "warn",
      detail: `${unreadable.length} deploy script(s) hand off to a script this check could not read: ${unreadable.join(", ")}`,
      fix: 'They may well be guarded \u2014 the hand-off leaves the repository, or the file is not there, so nothing here can say either way, and "could not check" must never be printed as "you are fine". Put `cycle guard-deploy` in the package.json script itself, or keep the wrapper inside the repository where this can follow it one step.'
    });
  }
  return checks;
}
function agentsMergeDriverChecks(root) {
  const attrsPath = join16(root, ".gitattributes");
  let mapped = false;
  try {
    mapped = existsSync11(attrsPath) && CC_AGENTS_MAPPING.test(readFileSync14(attrsPath, "utf8"));
  } catch {
    return [];
  }
  if (!mapped) {
    if (!existsSync11(join16(root, ".zones", "zones.yml"))) return [];
    return [{
      name: "AGENTS.md merge driver",
      status: "warn",
      detail: ".gitattributes does not map AGENTS.md to the cc-agents merge driver",
      fix: "A branch still carrying a cc:begin/cc:end block will conflict with main on merge (CC-543). `cycle init` writes the mapping and registers the driver; or add the line `AGENTS.md merge=cc-agents` to .gitattributes and run `cycle sync`, which registers the config whenever the mapping is present (CC-590)."
    }];
  }
  let driver = "";
  try {
    driver = execFileSync7("git", ["-C", root, "config", "--get", "merge.cc-agents.driver"], {
      stdio: ["ignore", "pipe", "ignore"]
    }).toString().trim();
  } catch {
  }
  if (driver) {
    return [{
      name: "AGENTS.md merge driver",
      status: "ok",
      detail: "cc-agents is mapped and configured \u2014 the cc-managed block will not conflict on merge"
    }];
  }
  return [{
    name: "AGENTS.md merge driver",
    status: "warn",
    detail: ".gitattributes maps AGENTS.md to cc-agents, but merge.cc-agents.driver is not set in this clone",
    fix: 'Without the driver, git falls back to a normal merge and AGENTS.md\'s cc:begin/cc:end block conflicts on every PR again (CC-543). `cycle sync` registers it on every pass now (CC-590) \u2014 run that, or set it by hand: `git config merge.cc-agents.driver "node scripts/merge-agents.mjs %O %A %B"` (no vendored script? the binary carries the driver: "cycle merge-driver %O %A %B"). Note it is `.driver` git consults \u2014 `.name` alone registers nothing.'
  }];
}
function runDoctor(root, now = /* @__PURE__ */ new Date(), opts = {}) {
  const checks = [];
  if (!existsSync11(join16(root, ".git"))) {
    return [{
      name: "git repository",
      status: "fail",
      detail: "this directory is not a git repository",
      fix: "CC binds tasks to branches, so it needs git. Run `git init` first."
    }];
  }
  checks.push({ name: "git repository", status: "ok", detail: root });
  const zonesPath = join16(root, ".zones", "zones.yml");
  let zonesOk = false;
  if (!existsSync11(zonesPath)) {
    checks.push({
      name: "zone map",
      status: "fail",
      detail: ".zones/zones.yml is missing",
      fix: "Run `cycle init`. Without it CC has no idea what is protected, so writes are denied."
    });
  } else {
    const parsed = parseZonesFile(readFileSync14(zonesPath, "utf8"));
    if (!parsed.ok) {
      checks.push({
        name: "zone map",
        status: "fail",
        detail: `.zones/zones.yml is invalid: ${parsed.issues[0]?.message ?? "unknown"}`,
        fix: "Fix the YAML. Until then writes are denied \u2014 CC will not guess what is protected."
      });
    } else {
      zonesOk = true;
      const n = parsed.value.zones.length;
      checks.push({
        name: "zone map",
        status: n === 0 ? "warn" : "ok",
        detail: n === 0 ? "valid, but declares no zones" : `${n} zone(s): ${parsed.value.zones.map((z) => z.id).join(", ")}`,
        fix: n === 0 ? "Nothing is protected. Run `cycle init` to propose some." : void 0
      });
      for (const w of parsed.warnings) {
        checks.push({ name: "zone map", status: "warn", detail: w.message });
      }
      const noOwner = parsed.value.zones.filter((z) => z.owner.includes("TODO"));
      if (noOwner.length) {
        checks.push({
          name: "zone owners",
          status: "warn",
          detail: `${noOwner.map((z) => z.id).join(", ")} still say TODO`,
          fix: "Set a real owner \u2014 that is who gets asked when access is requested."
        });
      }
    }
  }
  const report = enforcementReport(root, { now, ...opts });
  const settingsPath = join16(root, ".claude", "settings.json");
  if (!existsSync11(settingsPath)) {
    checks.push({
      name: "hook installed",
      status: "fail",
      detail: ".claude/settings.json is missing, so nothing is enforced",
      fix: "Run `cycle init`. Note: without the hook, CC only catches things at merge time."
    });
  } else {
    try {
      const settings = JSON.parse(readFileSync14(settingsPath, "utf8"));
      const cmd = settings?.hooks?.PreToolUse?.[0]?.hooks?.[0]?.command;
      if (!cmd) {
        checks.push({
          name: "hook installed",
          status: "fail",
          detail: "settings.json has no PreToolUse hook",
          fix: "Run `cycle init` to write it, or add the hook by hand."
        });
      } else {
        const resolved2 = cmd.replace("$CLAUDE_PROJECT_DIR", root);
        const there = existsSync11(resolved2);
        checks.push({
          name: "hook installed",
          status: there ? "ok" : "fail",
          /* The wording is deliberate now. This line used to be `cmd` alone,
             and it was the gap CC-442 measured: three vintages of the core
             were live on one machine, deciding differently, while this printed
             `ok` about a path — true, and not the question. It says which path
             and refers the age of what that path loads to the checks below. */
          detail: there ? `${cmd} \u2014 the path, which is all this line can see; the age of the core it loads is the next check` : `settings.json points at ${cmd}, which does not exist`,
          fix: there ? void 0 : "The path is wrong or the package is not installed. Nothing is being enforced right now."
        });
        if (there) {
          try {
            const mode = statSync5(resolved2).mode;
            if (!(mode & 73)) {
              checks.push({
                name: "hook executable",
                status: "fail",
                detail: "the hook script is not executable",
                fix: `Run: chmod +x ${resolved2}`
              });
            }
          } catch {
          }
        }
      }
    } catch {
      checks.push({
        name: "hook installed",
        status: "fail",
        detail: ".claude/settings.json is not valid JSON",
        fix: "Fix the JSON \u2014 Claude Code will not load hooks from a broken settings file."
      });
    }
  }
  checks.push(...report?.checks ?? enforcementChecks(root, { now }));
  checks.push(...report?.registrationChecks ?? []);
  const branch = currentBranch(root);
  const taskId = taskIdFrom(branch);
  if (!branch) {
    checks.push({
      name: "active task",
      status: "warn",
      detail: "detached HEAD \u2014 no branch, so no task",
      fix: "Check out a task branch. Writes are denied without one."
    });
  } else if (!taskId) {
    checks.push({
      name: "active task",
      status: "warn",
      detail: `on "${branch}", which is not a task branch`,
      fix: "Writes are denied here by design. Branch as task/CC-123-something to work."
    });
  } else {
    const grantPath = join16(root, ".zones", "state", "grants", `${taskId}.json`);
    if (!existsSync11(grantPath)) {
      checks.push({
        name: "active task",
        status: "warn",
        detail: `branch names task ${taskId}, but there is no grant for it`,
        fix: "The board issues grants when a task starts. Until then writes are denied."
      });
    } else {
      try {
        const state = resolveGrant(JSON.parse(readFileSync14(grantPath, "utf8")), now);
        if (state.state === "expired") {
          checks.push({
            name: "active task",
            status: "fail",
            detail: `the grant for ${taskId} expired at ${state.grant.expires}`,
            fix: "This is why writes stopped working. Ask for it to be re-issued."
          });
        } else if (state.state === "active") {
          const open = state.open.map((z) => `${z.id}:${z.mode}`).join(", ") || "no zones open";
          checks.push({ name: "active task", status: "ok", detail: `${taskId} \u2014 ${open}` });
        } else {
          checks.push({
            name: "active task",
            status: "warn",
            detail: `the grant for ${taskId} could not be read`,
            fix: "It may be corrupt. Ask for it to be re-issued."
          });
        }
        if (state.state !== "none" && state.grant.branch && state.grant.branch !== branch) {
          checks.push({
            name: "branch matches the grant",
            status: "warn",
            detail: `the grant names "${state.grant.branch}" and this is "${branch}"`,
            fix: "Nothing here creates branches \u2014 the gate derives a name and a person types one, so the two can drift apart silently. Correct the task record to the branch that exists, before a manifest gets computed against the wrong one."
          });
        }
        if (state.state !== "none" && state.grant.holder) {
          let stale = false;
          try {
            stale = holderLiveness(root, state.grant.holder.path) === "stale";
          } catch {
          }
          if (stale) {
            checks.push({
              name: "grant holder is live",
              status: "warn",
              detail: `the grant for ${taskId} names a holder git cannot find: ${state.grant.holder.path}`,
              fix: `That checkout is prunable or gone, so nothing is running under this grant where it says it is. This is a report, not a revocation \u2014 the grant still holds (the filesystem is authoritative, D-50). If the work truly moved on, \`cycle pause ${taskId} --reason "..."\` hands the grant back.`
            });
          }
        }
      } catch {
        checks.push({
          name: "active task",
          status: "warn",
          detail: `the grant file for ${taskId} is not valid JSON`,
          fix: "Delete it and ask for a new one."
        });
      }
    }
  }
  if (zonesOk) {
    try {
      execFileSync7("git", ["-C", root, "status", "--porcelain"], { stdio: ["ignore", "pipe", "ignore"] });
      checks.push({ name: "guard prerequisites", status: "ok", detail: "the working tree can be read" });
    } catch {
      checks.push({
        name: "guard prerequisites",
        status: "fail",
        detail: "git status failed, so Bash commands cannot be contained",
        fix: "They will be denied rather than run unguarded. Fix the repository state first."
      });
    }
  }
  let hasTimeout = false;
  for (const bin of ["timeout", "gtimeout"]) {
    try {
      execFileSync7("command", ["-v", bin], { stdio: "ignore", shell: true });
      hasTimeout = true;
      break;
    } catch {
    }
  }
  if (!hasTimeout) {
    checks.push({
      name: "hook timeout",
      status: "warn",
      detail: "neither timeout nor gtimeout is installed",
      fix: "A hung hook cannot be cut off. Install coreutils (brew install coreutils)."
    });
  }
  checks.push(...deployChecks(root));
  checks.push(...agentsMergeDriverChecks(root));
  const board2 = resolveBoard(root);
  if (!board2.tenant) {
    checks.push({
      name: "board scope",
      status: "warn",
      detail: "no tenant in CC_TENANT or .zones/board.json, so no board command will run",
      fix: "Set CC_TENANT, or name the tenant in .zones/board.json \u2014 the first half of the address in the console, e.g. `pow` in pow/commitcycle. There is no default: guessing writes into a tenant nobody created."
    });
  } else {
    const from = process.env.CC_TENANT || process.env.CC_API_URL ? "the environment" : ".zones/board.json";
    checks.push({
      name: "board scope",
      status: "ok",
      detail: board2.apiUrl ? `${board2.tenant}/${board2.repo} at ${board2.apiUrl}, from ${from}` : `${board2.tenant}/${board2.repo} \u2014 no board address, local commands only`
    });
  }
  checks.push({
    name: "tool surfaces",
    status: "ok",
    detail: "Edit, Write, Read and Bash by name; anything else is a write if it declares a path, and allowed-and-recorded if it does not"
  });
  const signedInAs = board2.apiUrl ? savedIdentity(board2.apiUrl) : void 0;
  let gitIdentity;
  try {
    gitIdentity = execFileSync7("git", ["config", "user.email"], { cwd: root, stdio: "pipe" }).toString().trim() || void 0;
  } catch {
  }
  if (signedInAs && gitIdentity && signedInAs !== gitIdentity) {
    checks.push({
      name: "one identity",
      status: "warn",
      detail: `records say ${signedInAs}, commits say ${gitIdentity}`,
      fix: `Records now carry the signed-in address, so nothing is written wrong \u2014 but the audit trail names two people for one person's work. Point them at each other: \`git config user.email ${signedInAs}\`, or sign in as ${gitIdentity}.`
    });
  }
  if (board2.apiUrl && isLoopback(board2.apiUrl)) {
    const committed = !process.env.CC_API_URL;
    checks.push({
      name: "board address",
      status: "warn",
      detail: `${board2.apiUrl} is a local board${committed ? ", and it is the committed default in .zones/board.json" : ""}`,
      fix: committed ? "Every clone of this repository reports here, and each local board keeps its own task sequence \u2014 so two of them will issue the same id to different work. Point .zones/board.json at the real board, and set CC_API_URL when you deliberately want a dev one." : "Task ids issued here are not the shared board's. Anything filed will collide the moment it meets the real sequence."
    });
  }
  return checks;
}
function isLoopback(apiUrl) {
  let host;
  try {
    host = new URL(apiUrl).hostname.toLowerCase();
  } catch {
    return false;
  }
  return host === "localhost" || host.endsWith(".localhost") || host === "127.0.0.1" || host.startsWith("127.") || host === "0.0.0.0" || host === "::1" || host === "[::1]";
}
function formatDoctor(checks) {
  const icon = { ok: "  ok  ", warn: " warn ", fail: " FAIL " };
  const lines = checks.map((c) => {
    const head = `[${icon[c.status]}] ${c.name.padEnd(22)} ${c.detail}`;
    return c.fix ? `${head}
${" ".repeat(11)}\u2192 ${c.fix}` : head;
  });
  const fails = checks.filter((c) => c.status === "fail").length;
  const warns = checks.filter((c) => c.status === "warn").length;
  const verdict = fails ? `
${fails} problem(s) stopping CC from working properly.` : warns ? `
Working, with ${warns} thing(s) worth knowing about.` : "\nEverything checks out.";
  return lines.join("\n") + "\n" + verdict;
}

// src/status.ts
import { existsSync as existsSync12, readFileSync as readFileSync15, realpathSync as realpathSync2 } from "node:fs";
import { join as join17 } from "node:path";
function samePath(a, b) {
  const r = (p) => {
    try {
      return realpathSync2(p);
    } catch {
      return p;
    }
  };
  return r(a) === r(b);
}
function runStatus(root, now = /* @__PURE__ */ new Date()) {
  const out = [];
  const resolved2 = currentBranch(root);
  const branch = resolved2 ?? "(no branch \u2014 a detached HEAD, or no readable .git)";
  const taskId = taskIdFrom(resolved2);
  out.push(`Branch   ${branch}`);
  out.push(`Task     ${taskId ?? "none \u2014 writes are denied until you are on a task branch"}`);
  const board2 = resolveBoard(root);
  out.push(`Board    ${board2.tenant ? `${board2.tenant}/${board2.repo}${board2.apiUrl ? ` at ${board2.apiUrl}` : " (no address \u2014 local commands only)"}` : "no tenant in CC_TENANT or .zones/board.json \u2014 board commands will refuse rather than guess"}`);
  let open = [];
  let expiresAt = null;
  let spike = false;
  const deferred = [];
  if (taskId) {
    const grantPath = join17(root, ".zones", "state", "grants", `${taskId}.json`);
    if (existsSync12(grantPath)) {
      try {
        const state = resolveGrant(JSON.parse(readFileSync15(grantPath, "utf8")), now);
        if (state.state === "active") {
          open = state.open;
          expiresAt = state.grant.expires;
          spike = state.grant.mode === "spike";
        } else if (state.state === "expired") {
          deferred.push(`
The grant expired at ${state.grant.expires} \u2014 that is why writes stopped.`);
        }
        if (state.state !== "none" && state.grant.branch && state.grant.branch !== branch) {
          deferred.push(
            `
The grant was issued for a different branch:
  grant   ${state.grant.branch}
  here    ${branch}
One of the two is wrong, and ${taskId} resolves either way because the id is read
from the branch name. Fix the record before closing \u2014 a manifest computed here
would be attributed to work the grant never covered.`
          );
        }
        const holder = state.state !== "none" ? state.grant.holder : void 0;
        if (holder && !samePath(holder.path, root)) {
          deferred.push(
            `
This grant is held by another checkout:
  holder  ${holder.path} (on ${holder.branch})
  here    ${root}
The grant was issued for that directory; write access lives where it is held.`
          );
        }
      } catch {
      }
    }
  }
  if (spike) {
    out.push(`Mode     spike \u2014 the database schema stays closed whatever is approved`);
  }
  out.push(...deferred);
  const zonesPath = join17(root, ".zones", "zones.yml");
  if (!existsSync12(zonesPath)) {
    out.push("\nNo zone map. Run `cycle init`.");
    return out.join("\n");
  }
  const parsed = parseZonesFile(readFileSync15(zonesPath, "utf8"));
  if (!parsed.ok) {
    out.push(`
The zone map is invalid: ${parsed.issues[0]?.message}`);
    out.push("Writes are denied until it parses. Run `cycle doctor`.");
    return out.join("\n");
  }
  out.push("");
  out.push("Zones");
  for (const z of parsed.value.zones) {
    const granted = open.find((o) => o.id === z.id);
    const state = granted ? `open for ${granted.mode}` : z.default_policy === "open" ? "open" : z.default_policy === "read-only" ? "readable, closed for writing" : "closed";
    out.push(`  ${z.id.padEnd(16)} ${state.padEnd(28)} ${z.paths.join(", ")}`);
  }
  out.push("");
  out.push("Everything else is unprotected \u2014 no approval needed inside a task.");
  if (expiresAt) {
    const mins = Math.round((Date.parse(expiresAt) - now.getTime()) / 6e4);
    out.push(`Access expires in ${mins > 60 ? `${Math.round(mins / 60)}h` : `${mins}m`}.`);
  }
  return out.join("\n");
}

// src/handoff.ts
import { existsSync as existsSync14, mkdirSync as mkdirSync8, readdirSync as readdirSync8, readFileSync as readFileSync17, writeFileSync as writeFileSync11 } from "node:fs";
import { basename as basename2, dirname as dirname11, isAbsolute as isAbsolute3, join as join19, relative as relative5, resolve as resolve4 } from "node:path";

// src/playbooks.ts
var import_yaml2 = __toESM(require_dist(), 1);
import { existsSync as existsSync13, readdirSync as readdirSync7, readFileSync as readFileSync16, writeFileSync as writeFileSync10 } from "node:fs";
import { join as join18 } from "node:path";
var REQUIRED_SECTIONS = [
  "## What an agent must know",
  "## Critical decisions",
  "## Known gaps",
  "## Feed rule"
];
var NAME_RULES = /^[a-z0-9]+(-[a-z0-9]+)*$/;
var CITATION = /\b(D-\d+|CC-\d+|E\d+)\b|§|\.[a-z]{2,8}\b/;
function scanPlaybooks(root) {
  const dir = join18(root, ".zones", "playbooks");
  if (!existsSync13(dir)) return null;
  const warnings = [];
  const books = [];
  const files = readdirSync7(dir).filter((f) => f.endsWith(".md") && f !== "README.md").sort();
  for (const file of files) {
    const rel = `.zones/playbooks/${file}`;
    const raw = readFileSync16(join18(dir, file), "utf8");
    const fm = parseFrontmatter(raw);
    if (!fm) {
      warnings.push(`${rel} has no frontmatter \u2014 not a playbook the loader can trust`);
      continue;
    }
    const topic = str(fm.data.topic) ?? file.replace(/\.md$/, "");
    const name = str(fm.data.name);
    const description = str(fm.data.description);
    const status = str(fm.data.status) ?? "seeded";
    if (!name) warnings.push(`${rel}: no "name" in the frontmatter (the compiled view's identity \u2014 docs/07 Rule 1)`);
    else if (name !== topic) warnings.push(`${rel}: name "${name}" \u2260 topic "${topic}" \u2014 the validator asserts they match`);
    else if (!NAME_RULES.test(name) || name.length > 64) warnings.push(`${rel}: name "${name}" breaks the skills name rules (lowercase, hyphens, \u226464)`);
    if (!description) warnings.push(`${rel}: no "description" \u2014 the compiled view would have no routing signal`);
    else if (description.length > 1024) warnings.push(`${rel}: description is ${description.length} chars \u2014 the skills spec caps it at 1024`);
    for (const heading of REQUIRED_SECTIONS) {
      if (!fm.body.split("\n").some((l) => l.startsWith(heading))) {
        warnings.push(`${rel}: missing required section "${heading}" (docs/07 Rule 1)`);
      }
    }
    for (const bullet of claimBullets(fm.body)) {
      if (!CITATION.test(bullet)) {
        warnings.push(`${rel}: uncited claim \u2014 "${bullet.slice(0, 60)}\u2026" (every claim carries a receipt, or it stays out; warn-only by rule)`);
      }
    }
    books.push({ file: rel, topic, name, description, status, display: displayName(fm.body, topic) });
  }
  return { books, warnings };
}
function writePlaybooksReadme(root, scan) {
  const path = join18(root, ".zones", "playbooks", "README.md");
  const active = scan.books.filter((b) => b.status !== "archived");
  const rows = active.map((b) => `| ${b.display} | [${b.topic}.md](${b.topic}.md) |`);
  const next = [
    "# Playbooks",
    "",
    "Per-topic, per-project agent context \u2014 seeded by the first audit of this",
    "codebase (CC-107, 2026-08-08), fed by every close that learns something.",
    "Contract and lifecycle: [docs/07-playbooks.md](../../docs/07-playbooks.md)",
    "(D-45, DECIDED \u2014 rev 3; the analysis record is docs/08-evolving-playbooks.md).",
    "",
    "<!-- The table is generated by cycle sync from the playbook files \u2014 edit them, not this. -->",
    "",
    "Before working a task, read the playbook for each of its declared topics:",
    "",
    "| Topic | File |",
    "|---|---|",
    ...rows,
    "",
    "Playbooks are Layer 1 class: advisory context. They never override",
    "`zones.yml`, the gate, or a decision row \u2014 they cite them.",
    ""
  ].join("\n");
  const current = existsSync13(path) ? readFileSync16(path, "utf8") : "";
  if (current === next) return "unchanged";
  writeFileSync10(path, next);
  return "updated";
}
function parseFrontmatter(raw) {
  if (!raw.startsWith("---\n")) return null;
  const end = raw.indexOf("\n---\n", 4);
  if (end < 0) return null;
  try {
    const data = (0, import_yaml2.parse)(raw.slice(4, end + 1));
    return data && typeof data === "object" ? { data, body: raw.slice(end + 5) } : null;
  } catch {
    return null;
  }
}
function str(v) {
  return typeof v === "string" && v.trim() ? v.trim() : void 0;
}
function displayName(body, topic) {
  const h1 = body.split("\n").find((l) => l.startsWith("# "));
  const m = h1?.match(/^#\s+(.+?)\s+playbook\b/i);
  return m?.[1] ?? topic;
}
function claimBullets(body) {
  return [
    ...sectionBullets(body, "## What an agent must know"),
    ...sectionBullets(body, "## Feed rule")
  ];
}
function sectionBullets(body, heading) {
  const lines = body.split("\n");
  const start = lines.findIndex((l) => l.startsWith(heading));
  if (start < 0) return [];
  const bullets = [];
  let current = null;
  for (let i = start + 1; i < lines.length; i++) {
    const line = lines[i];
    if (line.startsWith("## ")) break;
    if (line.startsWith("- ")) {
      if (current) bullets.push(current.join(" "));
      current = [line.slice(2)];
    } else if (current && /^\s+\S/.test(line)) {
      current.push(line.trim());
    } else if (current) {
      bullets.push(current.join(" "));
      current = null;
    }
  }
  if (current) bullets.push(current.join(" "));
  return bullets;
}

// src/handoff.ts
var LIVE = /* @__PURE__ */ new Set(["Todo", "In Progress", "In Review"]);
var clip = (s, max = 150) => {
  const flat = s.replace(/\s+/g, " ").trim();
  return flat.length <= max ? flat : `${flat.slice(0, max - 1).trimEnd()}\u2026`;
};
var cell = (s, max = 150) => clip(s, max).split("|").join("\\|");
var idNum = (id) => Number(/-(\d+)$/.exec(id)?.[1] ?? 0);
function scanAudits(root) {
  const dir = join19(root, ".zones", "audit");
  const audits = [];
  const missingTask = [];
  const unreadable = [];
  let names;
  try {
    names = readdirSync8(dir).filter((f) => f.endsWith(".md"));
  } catch {
    return { audits, missingTask, unreadable };
  }
  for (const name of names.sort()) {
    const rel = `.zones/audit/${name}`;
    let head;
    try {
      head = readFileSync17(join19(dir, name), "utf8").slice(0, 4e3);
    } catch {
      unreadable.push(rel);
      continue;
    }
    const task = /^task:[ \t]*(\S+)[ \t]*$/m.exec(head)?.[1];
    if (!task) {
      missingTask.push(rel);
      continue;
    }
    audits.push({
      file: rel,
      task,
      title: /^title:[ \t]*(.+)$/m.exec(head)?.[1]?.trim().replace(/^"|"$/g, ""),
      closed: /^closed:[ \t]*(.+)$/m.exec(head)?.[1]?.trim()
    });
  }
  return { audits, missingTask, unreadable };
}
function sectionFirstParagraph(text, heading) {
  const lines = text.split("\n");
  const at2 = lines.findIndex((l) => l.startsWith(heading));
  if (at2 < 0) return null;
  let i = at2 + 1;
  while (i < lines.length && lines[i].trim() === "") i++;
  const para = [];
  while (i < lines.length && lines[i].trim() !== "" && !lines[i].startsWith("#")) {
    para.push(lines[i].trim());
    i++;
  }
  return para.length ? para.join(" ") : null;
}
function firstSentence(text) {
  const flat = text.replace(/\s+/g, " ").trim();
  const m = /^.*?[.!?](?=\s|$)/.exec(flat);
  return m ? m[0] : flat;
}
function playbookUpdated(root, file) {
  try {
    const head = readFileSync17(join19(root, file), "utf8").slice(0, 2e3);
    return /^updated:[ \t]*(.+)$/m.exec(head)?.[1]?.trim() ?? "\u2014";
  } catch {
    return "\u2014";
  }
}
async function runHandoff(opts) {
  const root = opts.root;
  const now = opts.now ?? /* @__PURE__ */ new Date();
  const today = now.toISOString().slice(0, 10);
  const closedN = opts.closed ?? 10;
  const counts = {
    live: 0,
    openDecisions: 0,
    recentlyClosed: 0,
    dangling: 0,
    doneWithoutAudit: 0,
    unreadable: 0
  };
  const none = {
    ok: false,
    text: "",
    ownWriteRecorded: false,
    liveSource: "none",
    counts
  };
  let target = null;
  if (opts.out !== void 0) {
    target = isAbsolute3(opts.out) ? opts.out : resolve4(root, opts.out);
    const insideZones = relative5(resolve4(root, ".zones"), target);
    if (insideZones === "" || !insideZones.startsWith("..")) {
      return {
        ...none,
        refusal: "--out must not point into .zones/ \u2014 a briefing written there would be scanned,\ncounted and gated by the checks it describes. `cycle handoff --out HANDOFF.md`\nwrites it at the repository root instead. Nothing was written."
      };
    }
  }
  const cannot = [];
  let liveSource = "none";
  let boardRows = [];
  if (opts.offline) {
    cannot.push("the board was not asked (--offline)");
  } else if (!opts.board) {
    cannot.push("no board is configured (no api_url + tenant in .zones/board.json or the environment) \u2014 the board was not asked");
  } else {
    try {
      const r = await boardCall(
        { apiUrl: opts.board.apiUrl, tenant: opts.board.tenant, repo: opts.board.repo, token: opts.board.token, fetchImpl: opts.fetchImpl },
        "/tasks"
      );
      if (r.ok) {
        boardRows = r.body.tasks ?? [];
        liveSource = "board";
      } else {
        cannot.push(`the board could not answer: ${r.message}`);
      }
    } catch (err) {
      cannot.push(`the board is unreachable (${err.message})`);
    }
  }
  const rec = scanRecords(root);
  const recordRows = [...rec.records.values()];
  let live = [];
  if (liveSource === "board") {
    live = boardRows.filter((t) => LIVE.has(t.state)).map((t) => ({
      id: t.id,
      state: t.state,
      owner: t.owner ?? "\u2014",
      branch: t.branch ?? "\u2014",
      since: (t.created_at ?? "").slice(0, 10) || "\u2014"
    }));
  } else {
    liveSource = "records";
    live = recordRows.filter((r) => LIVE.has(r.state)).map((r) => ({ id: r.id, state: r.state, owner: "\u2014", branch: "\u2014", since: "\u2014" }));
    cannot.push(
      "Live work above is the record files' state, not the board's \u2014 a record file can be stale, and file state must never be read as board state"
    );
  }
  live.sort((a, b) => idNum(a.id) - idNum(b.id));
  counts.live = live.length;
  const agentsPath = join19(root, "AGENTS.md");
  const agentsRaw = existsSync14(agentsPath) ? readFileSync17(agentsPath, "utf8") : null;
  const layer1 = agentsRaw ? CC_BLOCK.exec(agentsRaw)?.[0] ?? null : null;
  const zonesPath = join19(root, ".zones", "zones.yml");
  let zones = null;
  let zonesInvalid = null;
  if (existsSync14(zonesPath)) {
    const parsed = parseZonesFile(readFileSync17(zonesPath, "utf8"));
    if (parsed.ok) {
      zones = parsed.value.zones.map((z) => ({
        id: z.id,
        policy: z.default_policy,
        owner: z.owner ?? "\u2014",
        paths: z.paths.join(", ")
      }));
    } else {
      zonesInvalid = parsed.issues[0]?.message ?? "unparseable";
      cannot.push(`.zones/zones.yml is invalid (${zonesInvalid}) \u2014 the zone map could not be read; \`cycle doctor\` says more`);
    }
  }
  const decisionLogPath = join19(root, "docs", "01-decisiones.md");
  const decisionLog = existsSync14(decisionLogPath) ? readFileSync17(decisionLogPath, "utf8") : null;
  const proposedRows = [];
  const decisionIds = /* @__PURE__ */ new Set();
  if (decisionLog) {
    for (const line of decisionLog.split("\n")) {
      const m = /^\|\s*(D-\d+[^|]*?)\s*\|([^|]*)\|([^|]*)\|/.exec(line);
      if (!m) continue;
      decisionIds.add(/D-\d+/.exec(m[1])[0]);
      if (m[3].trim().startsWith("PROPOSED")) proposedRows.push({ id: m[1], text: m[2].trim() });
    }
  }
  const decisionsDir = join19(root, ".zones", "decisions");
  const decisionFiles = [];
  const decisionsUnreadable = [];
  if (existsSync14(decisionsDir)) {
    for (const name of readdirSync8(decisionsDir).filter((f) => f.endsWith(".md")).sort()) {
      const rel = `.zones/decisions/${name}`;
      try {
        const raw = readFileSync17(join19(decisionsDir, name), "utf8");
        const status = /^- Status:[ \t]*(.+)$/m.exec(raw)?.[1]?.trim();
        if (!status) {
          decisionsUnreadable.push(rel);
          continue;
        }
        const title = /^#\s+(.+)$/m.exec(raw)?.[1]?.trim() ?? name;
        decisionFiles.push({ file: rel, title, status });
      } catch {
        decisionsUnreadable.push(rel);
      }
    }
  }
  const openFiles = decisionFiles.filter((d) => /^propos/i.test(d.status));
  counts.openDecisions = proposedRows.length + openFiles.length;
  const auditScan = scanAudits(root);
  const recent = auditScan.audits.slice().sort((a, b) => (b.closed ?? "").localeCompare(a.closed ?? "") || idNum(b.task ?? "") - idNum(a.task ?? "")).slice(0, closedN);
  counts.recentlyClosed = recent.length;
  const closedLines = recent.map((a) => {
    const id = a.task;
    const recordPath = join19(root, ".zones", "tasks", `${id}.md`);
    if (existsSync14(recordPath)) {
      try {
        const para = sectionFirstParagraph(readFileSync17(recordPath, "utf8"), "## Result");
        if (para) return { id, closed: a.closed ?? "\u2014", label: "result", line: clip(para) };
      } catch {
      }
    }
    try {
      const asked = sectionFirstParagraph(readFileSync17(join19(root, a.file), "utf8"), "## What was asked");
      if (asked) return { id, closed: a.closed ?? "\u2014", label: "asked", line: clip(firstSentence(asked)) };
    } catch {
    }
    return { id, closed: a.closed ?? "\u2014", label: "title", line: clip(a.title ?? id) };
  });
  const scan = scanPlaybooks(root);
  const books = (scan?.books ?? []).filter((b) => b.status !== "archived");
  const alwaysOn = books.filter((b) => !TOPICS.includes(b.topic));
  if (!alwaysOn.length) {
    cannot.push("no always-on playbook \u2014 no scanned playbook has a topic outside the board taxonomy (D-60), so nothing loads for every task");
  }
  const doneWithoutAudit = recordRows.filter((r) => r.state === "Done" && !existsSync14(join19(root, ".zones", "audit", `${r.id}.md`))).map((r) => r.id).sort((a, b) => idNum(a) - idNum(b));
  counts.doneWithoutAudit = doneWithoutAudit.length;
  const noDecisionLog = !decisionLog && !existsSync14(decisionsDir);
  if (noDecisionLog) cannot.push("no decision log in this repository \u2014 neither docs/01-decisiones.md nor .zones/decisions/ exists");
  const label2 = opts.board ? `${opts.board.tenant}/${opts.board.repo}` : basename2(root);
  const out = [];
  out.push(`# Day 1 \u2014 ${label2}`);
  out.push("");
  out.push(
    `Generated by \`cycle handoff\` on ${today}. Nothing here is authored: every line is`,
    "read from this repository or from the board it answers to. Regenerate it rather",
    "than editing it."
  );
  out.push("", "## Read these first", "");
  let n = 0;
  const item = (line) => {
    out.push(`${++n}. ${line}`);
  };
  if (agentsRaw) item("AGENTS.md \u2014 Layer 1: how work starts here (its CC block is reproduced below)");
  for (const b of alwaysOn) item(`${b.file} \u2014 the always-on playbook: read it whatever the task touches (D-60)`);
  if (decisionLog) item("docs/01-decisiones.md \u2014 the decision log; PROPOSED rows are waiting on an owner");
  item("The live tasks below \u2014 what is running right now");
  if (auditScan.audits.length) item(`The ${Math.min(closedN, auditScan.audits.length)} most recent audit records under .zones/audit/ \u2014 how work actually closes here`);
  if (!n) out.push("Nothing to point at \u2014 this repository has no Layer 1, no playbooks and no audit trail yet.");
  out.push("", "## How work starts here", "");
  if (layer1) {
    out.push("The committed AGENTS.md block, byte-for-byte \u2014 these bytes are what the next agent loads:", "");
    out.push(layer1);
  } else {
    out.push("This repository has no Layer 1 \u2014 no CC block in AGENTS.md. `cycle init` writes one.");
  }
  out.push("", "## The zone map", "");
  if (zones && zones.length) {
    out.push("| Zone | Policy | Owner | Paths |");
    out.push("|---|---|---|---|");
    for (const z of zones) out.push(`| ${cell(z.id)} | ${cell(z.policy)} | ${cell(z.owner)} | ${cell(z.paths)} |`);
    out.push("", "Everything not listed is unprotected inside an active task \u2014 and closed without one.");
  } else if (zonesInvalid) {
    out.push(`The zone map exists and does not parse (${zonesInvalid}) \u2014 writes are denied until it does. \`cycle doctor\` says more.`);
  } else {
    out.push("Nothing is protected here \u2014 no .zones/zones.yml. `cycle init` proposes one.");
  }
  out.push("", "## Live work", "");
  if (live.length) {
    out.push("| Task | State | Owner | Branch | Since |");
    out.push("|---|---|---|---|---|");
    for (const t of live) out.push(`| ${cell(t.id)} | ${cell(t.state)} | ${cell(t.owner)} | ${cell(t.branch)} | ${cell(t.since)} |`);
    if (liveSource === "records") {
      out.push("", "  note: these states are the record files', not the board's \u2014 see the last section.");
    }
  } else {
    out.push(liveSource === "board" ? "Nothing is live \u2014 the board holds no task in Todo, In Progress or In Review." : "Nothing is live in the record files \u2014 no task record in Todo, In Progress or In Review, and the board was not asked.");
  }
  out.push("", "## Open decisions", "");
  if (noDecisionLog) {
    out.push("No decision log in this repository \u2014 neither docs/01-decisiones.md nor .zones/decisions/ exists.");
  } else {
    if (decisionLog) {
      if (proposedRows.length) {
        out.push(`docs/01-decisiones.md \u2014 ${proposedRows.length} PROPOSED row(s) waiting on an owner:`, "");
        for (const d of proposedRows) out.push(`- ${d.id} \u2014 ${clip(d.text, 120)}`);
      } else {
        out.push("docs/01-decisiones.md \u2014 no PROPOSED rows; every decision there is decided or revised.");
      }
    }
    if (existsSync14(decisionsDir)) {
      if (decisionLog) out.push("");
      if (openFiles.length) {
        out.push(`.zones/decisions/ \u2014 ${openFiles.length} still open:`, "");
        for (const d of openFiles) out.push(`- ${clip(d.title, 100)} \u2014 Status: ${clip(d.status, 60)} (${d.file})`);
      } else {
        out.push(`.zones/decisions/ \u2014 ${decisionFiles.length} decision file(s), none waiting: accepted and rejected are both records (D-46).`);
      }
    }
  }
  out.push("", "## Recently closed", "");
  if (closedLines.length) {
    out.push(`The audit set under .zones/audit/ is authoritative for closed work \u2014 ${auditScan.audits.length} record(s); the ${closedLines.length} most recent:`, "");
    for (const c of closedLines) {
      out.push(`- ${c.id} (closed ${c.closed}) \u2014 ${c.label}: ${c.line}`);
    }
  } else {
    out.push("No audit records under .zones/audit/ \u2014 nothing has closed here yet, or closes never wrote their record.");
  }
  out.push("", "## Playbooks", "");
  if (books.length) {
    out.push("| Topic | Status | Last fed | File |");
    out.push("|---|---|---|---|");
    for (const b of books.slice().sort((a, z) => a.topic.localeCompare(z.topic))) {
      out.push(`| ${cell(b.topic)} | ${cell(b.status)} | ${cell(playbookUpdated(root, b.file))} | ${cell(b.file)} |`);
    }
    if (alwaysOn.length) {
      out.push("", `Always-on (D-60): ${alwaysOn.map((b) => b.file).join(", ")} \u2014 its topic is outside the board taxonomy, so no task declares it; read it regardless.`);
    }
  } else {
    out.push("No playbooks in this repository. `cycle seed` drafts them from the codebase, as choices \u2014 claims cite real files or are dropped.");
  }
  const emitted = out.join("\n");
  const liveIds = new Set(boardRows.map((t) => t.id));
  const dangling = [];
  for (const id of new Set(emitted.match(/\b(?:CC|D)-\d+\b/g) ?? [])) {
    const found = id.startsWith("D-") ? decisionIds.has(id) : existsSync14(join19(root, ".zones", "tasks", `${id}.md`)) || existsSync14(join19(root, ".zones", "audit", `${id}.md`)) || liveIds.has(id);
    if (!found) dangling.push(id);
  }
  dangling.sort((a, b) => a.localeCompare(b, void 0, { numeric: true }));
  counts.dangling = dangling.length;
  const unreadable = [];
  if (rec.unreadable.length) {
    unreadable.push(`${rec.unreadable.length} task record(s) with no readable id: frontmatter`);
  }
  if (auditScan.missingTask.length) {
    unreadable.push(`${auditScan.missingTask.length} audit record(s) with no task: key (${auditScan.missingTask.join(", ")}) \u2014 excluded from Recently closed`);
  }
  if (auditScan.unreadable.length) {
    unreadable.push(`${auditScan.unreadable.length} audit record(s) that could not be read`);
  }
  if (decisionsUnreadable.length) {
    unreadable.push(`${decisionsUnreadable.length} decision file(s) with no "- Status:" bullet (${decisionsUnreadable.join(", ")})`);
  }
  counts.unreadable = rec.unreadable.length + auditScan.missingTask.length + auditScan.unreadable.length + decisionsUnreadable.length;
  if (dangling.length) {
    const shown = dangling.slice(0, 12).join(", ");
    cannot.push(`${dangling.length} cited id(s) with no target in this repository: ${shown}${dangling.length > 12 ? ", \u2026" : ""}`);
  }
  if (doneWithoutAudit.length) {
    const shown = doneWithoutAudit.slice(0, 12).join(", ");
    cannot.push(`${doneWithoutAudit.length} task record(s) Done on disk with no audit record: ${shown}${doneWithoutAudit.length > 12 ? ", \u2026" : ""}`);
  }
  cannot.push(...unreadable);
  out.push("", "## What this briefing could not answer", "");
  if (cannot.length) {
    for (const line of cannot) out.push(`  note: ${line}`);
  } else {
    out.push("  Nothing \u2014 every source above answered.");
  }
  let text = out.join("\n");
  if (target) {
    mkdirSync8(dirname11(target), { recursive: true });
    writeFileSync11(target, `${text}
`);
    const rel = relative5(resolve4(root), target).split("\\").join("/");
    const recorded = recordOwnWrites(root, taskOnBranch(root), [rel]) > 0;
    return { ok: true, text, wrote: rel, ownWriteRecorded: recorded, liveSource, counts };
  }
  text += "\n\n  To keep this: `cycle handoff --out HANDOFF.md` writes it at the repository root \u2014 never into .zones/ \u2014 and records its own write.";
  return { ok: true, text, ownWriteRecorded: false, liveSource, counts };
}

// src/protect.ts
var import_yaml3 = __toESM(require_dist(), 1);
import { readFileSync as readFileSync18, writeFileSync as writeFileSync12 } from "node:fs";
import { join as join20 } from "node:path";
function loadDoc(root) {
  const path = join20(root, ".zones", "zones.yml");
  let raw;
  try {
    raw = readFileSync18(path, "utf8");
  } catch {
    return { error: "No .zones/zones.yml here. Run `cycle init` first." };
  }
  const parsed = parseZonesFile(raw);
  if (!parsed.ok) return { error: `zones.yml is invalid, fix that first: ${parsed.issues[0]?.message}` };
  return { doc: (0, import_yaml3.parseDocument)(raw), path };
}
function runProtect(root, glob, zoneId) {
  const loaded = loadDoc(root);
  if ("error" in loaded) return { ok: false, message: loaded.error };
  const { doc, path } = loaded;
  const zones = doc.get("zones");
  const items = zones?.items ?? [];
  const idx = items.findIndex((z) => z.get("id") === zoneId);
  if (idx === -1) {
    const known = items.map((z) => z.get("id")).join(", ");
    return {
      ok: false,
      message: `"${zoneId}" is not a zone here (known: ${known || "none"}). Creating a zone needs a name, an owner and a risk level \u2014 judgement calls that belong in the editor, not in flags. Add it to .zones/zones.yml, then re-run this.`
    };
  }
  const paths = items[idx].get("paths", true);
  const existing = paths.items.map((i) => String(i.value ?? i));
  if (existing.includes(glob)) {
    return { ok: true, message: `"${glob}" is already in "${zoneId}" \u2014 nothing to do.` };
  }
  paths.add(doc.createNode(glob));
  writeFileSync12(path, doc.toString());
  recordOwnWrites(root, taskOnBranch(root), [join20(".zones", "zones.yml")]);
  return {
    ok: true,
    message: `"${glob}" is now in "${zoneId}". The change is in zones.yml, in your diff \u2014 commit it with the work, and run \`cycle sync\` so the board learns the new boundary.`
  };
}
function runDismiss(root, glob) {
  const loaded = loadDoc(root);
  if ("error" in loaded) return { ok: false, message: loaded.error };
  const { doc, path } = loaded;
  let list = doc.get("unprotected", true);
  if (!list) {
    doc.set("unprotected", doc.createNode([]));
    list = doc.get("unprotected", true);
    list.commentBefore = " Reviewed and deliberately left open (flow C) \u2014 the closing\n gate stops asking about these. Everything not listed anywhere\n is ALSO unprotected; this list only silences the question.";
  }
  const existing = list.items.map((i) => String(i.value ?? i));
  if (existing.includes(glob)) {
    return { ok: true, message: `"${glob}" was already dismissed \u2014 nothing to do.` };
  }
  list.add(doc.createNode(glob));
  writeFileSync12(path, doc.toString());
  recordOwnWrites(root, taskOnBranch(root), [join20(".zones", "zones.yml")]);
  return {
    ok: true,
    message: `"${glob}" is recorded as reviewed-and-open. The closing gate stops asking about it. If that turns out to be wrong, \`cycle protect\` it later \u2014 the record of both decisions is the point.`
  };
}

// src/request-access.ts
async function runRequestAccess(opts) {
  const { root, apiUrl, token, tenant, repo } = opts;
  const doFetch = opts.fetchImpl ?? fetch;
  const log = opts.log ?? (() => {
  });
  const taskId = taskIdFrom(currentBranch(root));
  if (taskId && opts.taskId && opts.taskId !== taskId) {
    return {
      ok: false,
      taskId,
      failures: [{
        field: "task_id",
        message: `You asked for ${opts.taskId} but this branch is bound to ${taskId}. Check out the right branch first.`
      }]
    };
  }
  if (!taskId) {
    return {
      ok: false,
      taskId: null,
      failures: [{
        field: "branch",
        message: "Not on a task branch. Access is granted per task, so there has to be one to grant it to."
      }]
    };
  }
  const zones = readZoneLines(root);
  if (zones && !zones.some((z) => z.id === opts.zone)) {
    return {
      ok: false,
      taskId,
      failures: [{
        field: "zone",
        message: `"${opts.zone}" is not a zone here. Known: ${zones.map((z) => z.id).join(", ")}.`
      }]
    };
  }
  const base = `${apiUrl.replace(/\/+$/, "")}/v1/${tenant}/${repo}`;
  const headers = boardHeaders(token);
  const res = await doFetch(`${base}/access-requests`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      task_id: taskId,
      zone_id: opts.zone,
      mode: opts.mode,
      reason: opts.reason,
      alternative: opts.alternative,
      requested_by: opts.requestedBy
    })
  });
  if (res.status === 422) {
    const body = await res.json().catch(() => ({}));
    return { ok: false, taskId, failures: body.failures ?? [] };
  }
  if (!res.ok) {
    return {
      ok: false,
      taskId,
      failures: [{ field: "network", message: `The board answered ${res.status}. Nothing was requested.` }]
    };
  }
  const { request } = await res.json();
  log(`  ${request.id} is with the zone owner`);
  if (apiUrl) log(`  approve or deny: ${apiUrl.replace(/\/+$/, "")}/requests`);
  return { ok: true, taskId, requestId: request.id, failures: [] };
}

// src/submit.ts
import { execFileSync as execFileSync8 } from "node:child_process";
import { existsSync as existsSync16, readFileSync as readFileSync20, rmSync as rmSync4, writeFileSync as writeFileSync13 } from "node:fs";
import { join as join22 } from "node:path";

// src/record.ts
import { existsSync as existsSync15, readFileSync as readFileSync19 } from "node:fs";
import { join as join21 } from "node:path";
function readTaskRecord(root, taskId) {
  const path = join21(root, ".zones", "tasks", `${taskId}.md`);
  if (!existsSync15(path)) return null;
  const fm = parseFrontmatter(readFileSync19(path, "utf8"));
  if (!fm) return null;
  const topics = Array.isArray(fm.data.topics) ? fm.data.topics.filter((t) => typeof t === "string") : [];
  return {
    title: typeof fm.data.title === "string" ? fm.data.title : void 0,
    topics,
    /* Read, never trusted over the board. It is here for the hand-in hint,
       which is advice about what the close will ask for — the check itself
       stays the transition's, and a record that disagrees with the board is the
       record being stale (CC-416). */
    qualityGate: typeof fm.data.quality_gate === "string" ? fm.data.quality_gate : void 0
  };
}

// src/submit.ts
function nextStepAfterSubmit() {
  return "Handed in. Open the PR when you are ready.\n\nNothing closes it for you: when the work lands, run `cycle verify --close` to check the\ndiff against what the task declared and write its audit record. Until then the task sits\nin In Review and leaves no trail.";
}
function captureHint(taskId, gate) {
  const g = (gate ?? "").trim();
  if (!g || g.toLowerCase() === "none") return null;
  return `The quality gate on ${taskId} is "${g}", so \`cycle verify --close\` will ask for evidence
  and refuse without it. Attach it with --evidence, which takes a URL or a path and repeats:

      cycle verify --close --evidence https://\u2026
      cycle verify --close --evidence <a path you have committed>

  A path has to be committed in this repository first \u2014 the repo is the source of truth, not
  object storage, and a capture the record cannot resolve is evidence of nothing. Capture it
  now while the work is still in front of you.`;
}
var runSubmit = (opts) => handOff({ ...opts, to: "In Review" });
var runPause = (opts) => handOff({ ...opts, to: "Todo" });
async function handOff(opts) {
  const { root, apiUrl, token, tenant, repo, actor, to } = opts;
  const doFetch = opts.fetchImpl ?? fetch;
  const log = opts.log ?? (() => {
  });
  const warnings = [];
  const branch = currentBranch(root);
  const taskId = opts.taskId ?? taskIdFrom(branch);
  if (!taskId) {
    return {
      ok: false,
      taskId: null,
      branch,
      grantRemoved: false,
      warnings,
      failures: [{
        field: "branch",
        message: branch ? `"${branch}" is not a task branch, so there is nothing to hand off. CC binds work to the branch the gate named \u2014 or name the task explicitly.` : "No branch \u2014 a detached HEAD has no task attached to it. Name the task explicitly to act on one anyway."
      }]
    };
  }
  const standingOn = taskIdFrom(branch);
  if (taskId !== standingOn) {
    let heldBy;
    try {
      heldBy = otherCheckoutHolding(root, taskId);
    } catch (err) {
      return {
        ok: false,
        taskId,
        branch,
        grantRemoved: false,
        warnings,
        failures: [{
          field: "worktree",
          message: `${taskId} is not the task on this branch, so this would hand off work belonging to another checkout \u2014 and git could not be asked whether one is standing on it (${err.message.trim()}). Nothing was changed. Run it from the checkout that holds the task, or fix git and try again.`
        }]
      };
    }
    if (heldBy) {
      return {
        ok: false,
        taskId,
        branch,
        grantRemoved: false,
        warnings,
        failures: [{
          field: "worktree",
          message: `${taskId} is checked out in ${heldBy}, which is a live worktree \u2014 somebody is standing on it. Handing it off from here would revoke that checkout's grant mid-task, and its writes would stop at its next \`cycle sync\` with nothing there saying why. Nothing was changed. Hand it off from that directory, or wait for it to finish.`
        }]
      };
    }
  }
  const base = `${apiUrl.replace(/\/+$/, "")}/v1/${tenant}/${repo}`;
  const headers = boardHeaders(token);
  const res = await doFetch(`${base}/tasks/${taskId}/transition`, {
    method: "POST",
    headers,
    body: JSON.stringify({ to, actor, reason: opts.reason })
  });
  const drift = replyDrift(res);
  if (drift) warnings.push(`protocol: ${drift}`);
  const upgrade = await upgradeRequired(res);
  if (upgrade) {
    return {
      ok: false,
      taskId,
      branch,
      grantRemoved: false,
      warnings,
      failures: [{ field: "protocol", message: upgrade }]
    };
  }
  if (res.status === 422) {
    const body = await res.json().catch(() => ({}));
    try {
      const q = await doFetch(`${base}/tasks/${taskId}`, { headers });
      if (q.ok) {
        const { task } = await q.json();
        if (task?.state) {
          warnings.push(
            `the board answering this call sees ${taskId} in "${task.state}"${task.updated_at ? ` (updated ${task.updated_at})` : ""} \u2014 if that is not the state you see elsewhere, you are looking at two different stores`
          );
        }
      }
    } catch {
    }
    return { ok: false, taskId, branch, failures: body.failures ?? [], grantRemoved: false, warnings };
  }
  if (!res.ok) {
    return {
      ok: false,
      taskId,
      branch,
      grantRemoved: false,
      warnings,
      failures: [{ field: "network", message: `The board answered ${res.status}. Nothing was changed.` }]
    };
  }
  log(`  ${taskId} is now ${to}`);
  const moved = await res.json().catch(() => ({}));
  if (to === "Todo") {
    const recordPath = join22(root, ".zones", "tasks", `${taskId}.md`);
    const recordRel = join22(".zones", "tasks", `${taskId}.md`);
    if (!existsSync16(recordPath)) {
      warnings.push(`no record at ${recordRel} to write the pause into \u2014 the board moved anyway`);
    } else {
      try {
        const prior = readFileSync20(recordPath, "utf8");
        const lines = prior.replace(/^state:.*$/m, "state: Todo").split("\n");
        const row = `| ${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)} | Todo | Paused: ${opts.reason ?? ""} |`;
        const heading = lines.findIndex((l) => l.trim() === "## History");
        let at2 = -1;
        for (let i = heading + 1; heading !== -1 && i < lines.length; i++) {
          if (lines[i].trimStart().startsWith("|")) at2 = i;
          else if (at2 !== -1 && lines[i].trim() !== "") break;
        }
        if (at2 === -1) {
          lines.push("", "---", "", "## History", "", "| When | State | Note |", "|---|---|---|", row);
        } else {
          lines.splice(at2 + 1, 0, row);
        }
        writeFileSync13(recordPath, lines.join("\n"));
        recordOwnWrites(root, taskId, [recordRel]);
        log(`  ${recordRel} \u2014 Todo, with the reason under its history`);
      } catch (err) {
        warnings.push(
          `the board paused ${taskId} but its record could not be amended (${err.message}). Add the history row to ${recordRel} by hand \u2014 a paused record that still says In Progress is the drift this command exists to prevent.`
        );
      }
    }
  }
  const grant = join22(root, ".zones", "state", "grants", `${taskId}.json`);
  let grantRemoved = false;
  if (existsSync16(grant)) {
    try {
      rmSync4(grant, { force: true });
      grantRemoved = true;
      log("  the grant is gone \u2014 protected zones are closed again");
    } catch (err) {
      warnings.push(
        `the board revoked the grant but ${grant} could not be removed (${err.message}). Delete it by hand \u2014 until you do, the hook still honours it.`
      );
    }
  }
  if (taskId === taskIdFrom(branch)) {
    if (clearLocalBlock(root).changed) {
      log("  CLAUDE.local.md cleared \u2014 no task is active");
    }
    const zones = readZoneLines(root);
    if (zones && writeAgentsBlock(root, renderDurableBlock({ zones, board: readBoardBinding(root), enforcement: detectEnforcement(root) })).changed) {
      recordOwnWrites(root, taskId, ["AGENTS.md"]);
      log("  AGENTS.md \u2014 settled to the durable zone map");
      let identicalToHead = false;
      try {
        execFileSync8("git", ["diff", "--quiet", "HEAD", "--", "AGENTS.md"], { cwd: root, stdio: "pipe" });
        identicalToHead = true;
      } catch {
      }
      if (identicalToHead) {
        log("  the block was never committed, so the clear leaves nothing to commit");
      } else {
        try {
          execFileSync8(
            "git",
            ["commit", "-q", "-m", `${taskId}: clear the CC block on hand-in`, "--", "AGENTS.md"],
            { cwd: root, stdio: "pipe" }
          );
          log("  and committed \u2014 the hand-in carries its own clear");
        } catch (err) {
          warnings.push(
            `AGENTS.md was cleared but the clear could not be committed (${err.message.trim()}). Commit it yourself before pushing, or the task block ships with the work.`
          );
        }
      }
    }
  }
  if (to === "In Review") {
    const hint = captureHint(taskId, moved.task?.quality_gate ?? readTaskRecord(root, taskId)?.qualityGate);
    if (hint) log(`
  ${hint}`);
  }
  return { ok: true, taskId, branch, failures: [], grantRemoved, warnings };
}

// src/feed.ts
import { readFileSync as readFileSync21, writeFileSync as writeFileSync14 } from "node:fs";
import { join as join23 } from "node:path";
var FEED_RULE = "## Feed rule";
function runFeed(root, topic, text, taskId) {
  const scan = scanPlaybooks(root);
  const book = scan?.books.find((b) => b.topic === topic);
  if (!book) {
    return { ok: false, warning: `topic "${topic}" has no playbook \u2014 nothing to feed (the birth rule: no cited content, no topic)` };
  }
  if (book.status === "archived") {
    return { ok: false, warning: `topic "${topic}" is archived \u2014 its playbook keeps its history and takes no new bullets` };
  }
  const path = join23(root, book.file);
  const raw = readFileSync21(path, "utf8");
  const lines = raw.split("\n");
  const start = lines.findIndex((l) => l.startsWith(FEED_RULE));
  let insert;
  let warning;
  if (start < 0) {
    insert = lines.length;
    while (insert > 0 && lines[insert - 1].trim() === "") insert--;
    warning = `${book.file} has no "${FEED_RULE}" section \u2014 the bullet landed at the end of the file`;
  } else {
    let end = lines.length;
    for (let i = start + 1; i < lines.length; i++) {
      if (lines[i].startsWith("## ")) {
        end = i;
        break;
      }
    }
    insert = end;
    while (insert > start + 1 && lines[insert - 1].trim() === "") insert--;
  }
  const bullet = `- ${withProvenance(text.trim(), taskId)}`;
  const opensList = insert > 0 && !/^- /.test(lines[insert - 1]);
  lines.splice(insert, 0, ...opensList ? ["", bullet] : [bullet]);
  const today = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
  const bumped = lines.map((l, i) => i < 20 && /^updated: /.test(l) ? `updated: ${today}` : l);
  writeFileSync14(path, bumped.join("\n"));
  recordOwnWrites(root, taskId ?? null, [book.file]);
  return warning ? { ok: true, path: book.file, bullet, warning } : { ok: true, path: book.file, bullet };
}
function withProvenance(text, taskId) {
  if (!taskId || text.includes(taskId)) return text;
  return `${text} (${taskId})`;
}
function feedOffers(root, taskId, touched) {
  const scan = scanPlaybooks(root);
  if (!scan) {
    return [
      "this repository has no playbooks yet. `cycle seed` drafts them from your own codebase,\n    as choices you accept one at a time:\n\n    cycle seed                       # every topic with something to cite\n    cycle seed --topics backend,qa   # or only these\n\n    Claims cite real files or are dropped, and a topic with nothing to cite is never born.\n    Nothing runs it for you \u2014 what a playbook says is yours to accept."
    ];
  }
  const record = readTaskRecord(root, taskId);
  if (!record?.topics.length) return [];
  const offers = [];
  for (const topic of record.topics) {
    const book = scan.books.find((b) => b.topic === topic);
    if (!book || book.status === "archived") continue;
    if (touched?.has(book.file)) continue;
    const rule = feedRuleLine(join23(root, book.file));
    offers.push(
      `${topic} \u2014 ${rule ?? "one bullet, one citation"}
    cycle feed ${topic} "what this close taught (${taskId})"   # skipping is legal by rule`
    );
  }
  return offers;
}
function feedRuleLine(path) {
  try {
    const lines = readFileSync21(path, "utf8").split("\n");
    const start = lines.findIndex((l) => l.startsWith("## Feed rule"));
    if (start < 0) return null;
    const body = lines.slice(start + 1).join(" ").trim();
    const sentence = body.split(/(?<=\.)\s/)[0]?.trim();
    return sentence ? sentence.replace(/\s+/g, " ") : null;
  } catch {
    return null;
  }
}

// src/seed.ts
import { execFileSync as execFileSync9 } from "node:child_process";
import { existsSync as existsSync17, mkdirSync as mkdirSync9, readFileSync as readFileSync22, writeFileSync as writeFileSync15 } from "node:fs";
import { join as join24 } from "node:path";
async function runSeed(input) {
  const { root, apiUrl, tenant, repo, token } = input;
  const log = input.log ?? (() => {
  });
  const doFetch = input.fetchImpl ?? fetch;
  const { brief, files } = buildBrief(root);
  log(`  brief built: ${files.length} file(s) in the inventory`);
  const headers = boardHeaders(token);
  let res;
  try {
    res = await doFetch(`${apiUrl.replace(/\/+$/, "")}/v1/${tenant}/${repo}/seed`, {
      method: "POST",
      headers,
      body: JSON.stringify({ brief, files, topics: input.topics })
    });
  } catch {
    log("  the board is unreachable \u2014 try again when it is; the contract (docs/07) works by hand too");
    return { status: "unavailable", written: [], skipped: [], notBorn: [] };
  }
  if (res.status === 501) {
    const body2 = await res.json().catch(() => ({}));
    log(`  ${body2.message ?? "No model is configured. Write the playbooks by hand \u2014 the contract is docs/07."}`);
    return { status: "not_configured", written: [], skipped: [], notBorn: [] };
  }
  if (res.status === 503) {
    log("  the model is unavailable \u2014 try again; nothing was written");
    return { status: "unavailable", written: [], skipped: [], notBorn: [] };
  }
  if (res.status === 422) {
    const body2 = await res.json().catch(() => ({}));
    for (const p of body2.problems ?? []) log(`  note: ${p.field} \u2014 ${p.message}`);
    log("  the drafts did not survive validation \u2014 nothing unvalidated is ever shown; write by hand or retry");
    return { status: "invalid", written: [], skipped: [], notBorn: [] };
  }
  if (!res.ok) {
    log(`  the board answered ${res.status} to /seed \u2014 is it running current code? Restart it after apps/api changes (release playbook), then retry`);
    return { status: "unavailable", written: [], skipped: [], notBorn: [] };
  }
  const body = await res.json();
  const written = [];
  const skipped = [];
  for (const draft of body.drafts) {
    const rel = join24(".zones", "playbooks", `${draft.topic}.md`);
    if (existsSync17(join24(root, rel))) {
      skipped.push(draft.topic);
      log(`  ${draft.topic}: a playbook already exists \u2014 the seed never overwrites; feed it instead (cycle feed)`);
      continue;
    }
    const wanted = input.ask ? await input.ask(`Seed "${draft.topic}" \u2014 ${draft.claims.length} cited claim(s): ${draft.description.slice(0, 80)}\u2026?`) : true;
    if (!wanted) {
      skipped.push(draft.topic);
      log(`  ${draft.topic}: skipped \u2014 your call, recorded as nothing (a skipped seed is not a decision)`);
      continue;
    }
    mkdirSync9(join24(root, ".zones", "playbooks"), { recursive: true });
    writeFileSync15(join24(root, rel), renderPlaybook(draft, repo));
    written.push(draft.topic);
    log(`  ${draft.topic}: written \u2014 ${rel}`);
  }
  for (const nb of body.notBorn) {
    log(`  ${nb.topic}: not born \u2014 ${nb.why}`);
  }
  if (written.length) {
    const scan = scanPlaybooks(root);
    let readmeChanged = false;
    if (scan) {
      readmeChanged = writePlaybooksReadme(root, scan) === "updated";
      for (const w of scan.warnings) log(`  note: ${w}`);
    }
    recordOwnWrites(root, taskOnBranch(root), [
      ...written.map((topic) => join24(".zones", "playbooks", `${topic}.md`)),
      ...readmeChanged ? [join24(".zones", "playbooks", "README.md")] : []
    ]);
  }
  return { status: written.length ? "seeded" : "nothing", written, skipped, notBorn: body.notBorn };
}
function renderPlaybook(draft, repo) {
  const today = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
  const cites = [...new Set(draft.claims.flatMap((c) => c.cites))];
  const display = draft.topic[0].toUpperCase() + draft.topic.slice(1);
  return [
    "---",
    `name: ${draft.topic}`,
    `description: ${JSON.stringify(draft.description)}`,
    `topic: ${draft.topic}`,
    "status: seeded",
    "seeded_by: cc-seed",
    `sources: [${cites.map((c) => JSON.stringify(c)).join(", ")}]`,
    `updated: ${today}`,
    "---",
    "",
    `# ${display} playbook \u2014 ${repo}`,
    "",
    draft.mandate || `${display}, as this repository actually runs it.`,
    "",
    "## What an agent must know",
    "",
    ...draft.claims.map((c) => `- ${c.text} (${c.cites.join(", ")})`),
    "",
    "## Critical decisions binding this topic",
    "",
    "None yet \u2014 the first rows arrive when a challenger proposal is accepted",
    "(D-46) or a close feeds one.",
    "",
    "## Known gaps, honestly",
    "",
    ...draft.gaps.length ? draft.gaps.map((g) => `- ${g}`) : ["- None recorded at seed time \u2014 the first closes will say."],
    "",
    "## Feed rule",
    "",
    draft.feed_rule || "When a close teaches something about this discipline, it lands here \u2014 one bullet, one citation.",
    ""
  ].join("\n");
}
function buildBrief(root) {
  const git3 = (args) => {
    try {
      return execFileSync9("git", args, { cwd: root, stdio: "pipe" }).toString();
    } catch {
      return "";
    }
  };
  const all = git3(["ls-files"]).split("\n").filter(Boolean);
  const files = all.slice(0, 2e3);
  const parts = [];
  const readme = join24(root, "README.md");
  if (existsSync17(readme)) {
    parts.push("README.md, first lines:", "", readFileSync22(readme, "utf8").split("\n").slice(0, 50).join("\n"));
  }
  const pkg = join24(root, "package.json");
  if (existsSync17(pkg)) {
    try {
      const p = JSON.parse(readFileSync22(pkg, "utf8"));
      parts.push(
        "",
        "package.json (name, scripts, workspaces):",
        "",
        JSON.stringify({ name: p.name, scripts: Object.keys(p.scripts ?? {}), workspaces: p.workspaces }, null, 1)
      );
    } catch {
    }
  }
  const dirs = /* @__PURE__ */ new Map();
  for (const f of all) {
    const seg = f.split("/").slice(0, 2).join("/");
    if (seg.includes("/")) dirs.set(seg, (dirs.get(seg) ?? 0) + 1);
  }
  const top = [...dirs.entries()].sort((a, b) => b[1] - a[1]).slice(0, 20);
  if (top.length) {
    parts.push(
      "",
      "Directory shape (top second-level dirs by file count):",
      "",
      ...top.map(([d, n]) => `  ${d}/ \u2014 ${n} file(s)`)
    );
  }
  const log = git3(["log", "--format=%s", "-n", "20"]).trim();
  if (log) parts.push("", "Recent commit subjects:", "", log);
  if (all.length > files.length) {
    parts.push("", `(inventory capped at ${files.length} of ${all.length} files)`);
  }
  return { brief: parts.join("\n"), files };
}

// src/challenge.ts
import { existsSync as existsSync18, mkdirSync as mkdirSync10, readdirSync as readdirSync9, writeFileSync as writeFileSync16 } from "node:fs";
import { join as join25 } from "node:path";
async function runChallenge(input) {
  const { root, apiUrl, tenant, repo, token } = input;
  const log = input.log ?? (() => {
  });
  const doFetch = input.fetchImpl ?? fetch;
  const none = { status: "nothing", accepted: [], rejected: [], skipped: 0, proposals: [] };
  const { brief } = buildBrief(root);
  const scan = scanPlaybooks(root);
  const playbooks = (scan?.books ?? []).filter((b) => b.status !== "archived").map((b) => ({ topic: b.topic, description: b.description ?? "" }));
  const headers = boardHeaders(token);
  let res;
  try {
    res = await doFetch(`${apiUrl.replace(/\/+$/, "")}/v1/${tenant}/${repo}/challenge`, {
      method: "POST",
      headers,
      body: JSON.stringify({ brief, playbooks })
    });
  } catch {
    log("  the board is unreachable \u2014 try again when it is");
    return { ...none, status: "unavailable" };
  }
  if (res.status === 501) {
    const body2 = await res.json().catch(() => ({}));
    log(`  ${body2.message ?? "No model is configured \u2014 the challenger needs one."}`);
    return { ...none, status: "not_configured" };
  }
  if (res.status === 503) {
    log("  the model is unavailable \u2014 try again; nothing was written");
    return { ...none, status: "unavailable" };
  }
  if (res.status === 422) {
    const body2 = await res.json().catch(() => ({}));
    for (const p of body2.problems ?? []) log(`  note: ${p.field} \u2014 ${p.message}`);
    log("  the proposals did not survive validation \u2014 nothing unvalidated is ever shown");
    return { ...none, status: "invalid" };
  }
  if (!res.ok) {
    log(`  the board answered ${res.status} to /challenge \u2014 is it running current code? Restart it after apps/api changes, then retry`);
    return { ...none, status: "unavailable" };
  }
  const body = await res.json();
  for (const d of body.dropped ?? []) log(`  note: ${d.message}`);
  if (!body.proposals.length) {
    log("  the challenger found nothing to propose \u2014 for a repository, that is a compliment");
    return { ...none, status: "nothing" };
  }
  if (!input.ask) {
    for (const p of body.proposals) {
      log("");
      log(`  ${p.title}`);
      log(`    source       ${p.market_source}`);
      log(`    consequence  ${p.local_consequence}`);
      log(`    first step   ${p.suggestion}`);
    }
    log("");
    log("  Decisions need a human: run `cycle challenge` in a terminal to accept or reject these.");
    return { ...none, status: "print-only", proposals: body.proposals };
  }
  const accepted = [];
  const rejected = [];
  let skipped = 0;
  let next = nextDecisionNumber(root);
  for (const p of body.proposals) {
    const verdict = await input.ask(p);
    if (verdict === "skip") {
      skipped++;
      log(`  ${p.title}: skipped \u2014 not judged, not recorded`);
      continue;
    }
    const grounds = verdict === "reject" ? (await input.grounds?.(p))?.trim() || "not stated" : void 0;
    const rel = writeDecision(root, next++, p, verdict, grounds);
    (verdict === "accept" ? accepted : rejected).push(rel);
    log(`  ${p.title}: ${verdict === "accept" ? "accepted" : "rejected, refused knowingly"} \u2014 ${rel}`);
  }
  return { status: "done", accepted, rejected, skipped, proposals: body.proposals };
}
function nextDecisionNumber(root) {
  const dir = join25(root, ".zones", "decisions");
  if (!existsSync18(dir)) return 1;
  const max = readdirSync9(dir).map((f) => /^(\d{4})-/.exec(f)?.[1]).filter((n) => !!n).reduce((a, n) => Math.max(a, Number(n)), 0);
  return max + 1;
}
var slug = (title) => title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40);
function writeDecision(root, n, p, verdict, grounds) {
  const num2 = String(n).padStart(4, "0");
  const rel = join25(".zones", "decisions", `${num2}-${slug(p.title)}.md`);
  const today = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
  const lines = [
    `# ${num2} \u2014 ${p.title}`,
    "",
    `- Status: ${verdict === "accept" ? "accepted" : "rejected \u2014 refused knowingly"}`,
    `- Date: ${today}`,
    "- Proposed by: challenger (`cycle challenge`, D-46)",
    `- Market source: ${p.market_source}`,
    "",
    "## Local consequence",
    "",
    p.local_consequence,
    "",
    "## Suggestion",
    "",
    p.suggestion,
    ""
  ];
  if (verdict === "reject") {
    lines.push("## Grounds", "", grounds ?? "not stated", "");
  }
  mkdirSync10(join25(root, ".zones", "decisions"), { recursive: true });
  writeFileSync16(join25(root, rel), lines.join("\n"));
  recordOwnWrites(root, taskOnBranch(root), [rel]);
  return rel;
}

// src/close.ts
import { existsSync as existsSync21, mkdirSync as mkdirSync12, readFileSync as readFileSync25, writeFileSync as writeFileSync18 } from "node:fs";
import { dirname as dirname13, join as join28 } from "node:path";

// src/verify.ts
import { execFileSync as execFileSync10 } from "node:child_process";
import { existsSync as existsSync19, readdirSync as readdirSync10, readFileSync as readFileSync23 } from "node:fs";
import { join as join26 } from "node:path";
var git2 = (root, cmd) => (
  // stderr is piped, not inherited: forkPoint probes refs that may not exist,
  // and a repo with no remote would otherwise print two `fatal:` lines on
  // every verify. Failures still throw, with stderr on the error object.
  execFileSync10("/bin/sh", ["-c", `git ${cmd}`], {
    cwd: root,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"]
  }).replace(/\n+$/, "")
);
function forkPoint(root, explicit) {
  if (explicit) return { sha: git2(root, `rev-parse ${explicit}`), how: `the --base you passed (${explicit})` };
  for (const candidate of ["origin/main", "origin/master", "main", "master"]) {
    try {
      return { sha: git2(root, `merge-base HEAD ${candidate}`), how: `the merge base with ${candidate}` };
    } catch {
    }
  }
  return { sha: git2(root, "rev-list --max-parents=0 HEAD | tail -1"), how: "the root commit \u2014 no main or master ref exists" };
}
function buildManifest(root, base) {
  const files = /* @__PURE__ */ new Map();
  const record = (status, path) => {
    if (path.startsWith(".zones/state/")) return;
    if (path.startsWith(".claude/worktrees/")) return;
    const s = status.startsWith("A") || status === "??" ? "A" : status.startsWith("D") ? "D" : "M";
    if (!files.has(path) || files.get(path) === "M") files.set(path, s);
  };
  for (const line of git2(root, `diff --name-status ${base}...HEAD`).split("\n")) {
    const [status, ...rest] = line.split("	");
    if (status && rest.length) record(status, rest[rest.length - 1]);
  }
  for (const line of git2(root, "status --porcelain --untracked-files=all").split("\n")) {
    if (!line.trim()) continue;
    record(line.slice(0, 2).trim(), line.slice(3).trim());
  }
  return {
    branch: git2(root, "rev-parse --abbrev-ref HEAD"),
    base,
    head: git2(root, "rev-parse HEAD"),
    files: [...files].map(([path, status]) => ({ path, status }))
  };
}
function trunk(root) {
  for (const ref of ["origin/main", "origin/master", "main", "master"]) {
    try {
      git2(root, `rev-parse --verify ${ref}`);
      return ref;
    } catch {
    }
  }
  return null;
}
function branchOf(root, taskId) {
  let name;
  try {
    const fm = readFileSync23(join26(root, ".zones", "tasks", `${taskId}.md`), "utf8").slice(0, 2e3);
    name = /^branch:[ \t]*(.+)$/m.exec(fm)?.[1]?.trim();
  } catch {
    return null;
  }
  if (!name || name === "null") return null;
  for (const ref of [name, `origin/${name}`]) {
    try {
      execFileSync10("git", ["-C", root, "rev-parse", "--verify", "-q", ref], { stdio: "ignore" });
      return ref;
    } catch {
    }
  }
  return null;
}
function subjectOf(root, sha) {
  try {
    return git2(root, `log -1 --format=%s ${sha}`);
  } catch {
    return "(unreadable)";
  }
}
function reachableFrom(root, sha, ref) {
  try {
    execFileSync10("git", ["-C", root, "merge-base", "--is-ancestor", sha, ref], { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}
function alreadyMerged(root, ref) {
  try {
    execFileSync10("git", ["-C", root, "merge-base", "--is-ancestor", "HEAD", ref], { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}
function historyCommits(root, taskId, ref) {
  try {
    const out = git2(root, `log --no-merges --format=%H%x09%s ${ref}`);
    const anchor = new RegExp(`^${taskId}(?![0-9])`);
    const found = [];
    for (const line of out.split("\n")) {
      const tab = line.indexOf("	");
      if (tab < 0) continue;
      const sha = line.slice(0, tab).trim();
      if (sha && anchor.test(line.slice(tab + 1).trim())) found.push(sha);
    }
    return found;
  } catch {
    return [];
  }
}
function buildHistoryManifest(root, taskId, shas) {
  const files = /* @__PURE__ */ new Map();
  for (const sha of [...shas].reverse()) {
    for (const line of git2(root, `show --pretty= --name-status ${sha}`).split("\n")) {
      const [status, ...rest] = line.split("	");
      if (!status || !rest.length) continue;
      const path = rest[rest.length - 1];
      if (path.startsWith(".zones/state/")) continue;
      const s = status.startsWith("A") ? "A" : status.startsWith("D") ? "D" : "M";
      if (!files.has(path) || files.get(path) === "M") files.set(path, s);
    }
  }
  const oldest = shas[shas.length - 1];
  const newest = shas[0];
  let base = oldest;
  try {
    base = git2(root, `rev-parse ${oldest}^`);
  } catch {
  }
  return {
    // Named, not disguised. Anything reading the audit record later should see
    // at a glance that this manifest came from the log and not from a branch.
    branch: `history:${taskId} (${shas.length} commit(s) in the trunk)`,
    base,
    head: newest,
    files: [...files].map(([path, status]) => ({ path, status }))
  };
}
function grantOnDisk(root, taskId) {
  const path = join26(root, ".zones", "state", "grants", `${taskId}.json`);
  if (!existsSync19(path)) return { kind: "none" };
  try {
    const g = JSON.parse(readFileSync23(path, "utf8"));
    return { kind: "grant", zones: g.zones ?? [] };
  } catch {
    return { kind: "unreadable" };
  }
}
function mutatedPaths(root) {
  const dir = join26(root, ".zones", "state", "events");
  if (!existsSync19(dir)) return [];
  const logs = readdirSync10(dir).filter((f) => f.endsWith(".jsonl"));
  const observed = [];
  const selfRecorded = [];
  for (const file of logs) {
    for (const line of readFileSync23(join26(dir, file), "utf8").split("\n").filter(Boolean)) {
      try {
        const e = JSON.parse(line);
        if (e.type !== "mutation" || !e.path) continue;
        (e.tool ? observed : selfRecorded).push(e.path);
      } catch {
      }
    }
  }
  if (!observed.length) return [];
  return [...observed, ...selfRecorded];
}
function runVerify(opts) {
  const { root } = opts;
  const log = opts.log ?? (() => {
  });
  const onBranch = taskOnBranch(root);
  if (!opts.fromHistory && opts.taskId && opts.taskId !== onBranch) {
    return {
      ok: false,
      taskId: onBranch,
      manifest: null,
      generated: [],
      unprotected: [],
      warnings: [],
      failures: [{
        field: "task",
        message: onBranch ? `You asked for ${opts.taskId} but this branch is bound to ${onBranch}. Check out ${opts.taskId}'s branch first, or drop the id to act on ${onBranch}. (--from-history reads a task out of history on purpose; without it the branch is the source of truth.)` : `You asked for ${opts.taskId} but this checkout is on no task branch, so there is nothing to bind it to. Check out ${opts.taskId}'s branch first.`
      }]
    };
  }
  const taskId = (opts.fromHistory ? opts.taskId : void 0) ?? onBranch;
  if (!taskId) {
    return {
      ok: false,
      taskId: null,
      manifest: null,
      generated: [],
      unprotected: [],
      warnings: [],
      failures: [{
        field: "branch",
        message: opts.fromHistory ? "Not on a task branch, and no task named. With --from-history, pass the id: `cycle verify --from-history CC-40`." : "Not on a task branch. There is nothing to verify against."
      }]
    };
  }
  const zonesPath = join26(root, ".zones", "zones.yml");
  if (!existsSync19(zonesPath)) {
    return {
      ok: false,
      taskId,
      manifest: null,
      generated: [],
      unprotected: [],
      warnings: [],
      failures: [{ field: "zones", message: "No .zones/zones.yml. Run `cycle init` first." }]
    };
  }
  const parsed = parseZonesFile(readFileSync23(zonesPath, "utf8"));
  if (!parsed.ok) {
    return {
      ok: false,
      taskId,
      manifest: null,
      generated: [],
      unprotected: [],
      warnings: [],
      failures: [{ field: "zones", message: `zones.yml is invalid: ${parsed.issues[0]?.message}` }]
    };
  }
  const ref = trunk(root);
  const early = [];
  const notes = [];
  let manifest;
  if (opts.fromHistory) {
    if (!ref) {
      return {
        ok: false,
        taskId,
        manifest: null,
        generated: [],
        unprotected: [],
        warnings: [],
        failures: [{ field: "manifest", message: "No trunk ref (origin/main, main, \u2026), so there is no history to read the task out of." }]
      };
    }
    const shas = historyCommits(root, taskId, ref);
    if (!shas.length) {
      return {
        ok: false,
        taskId,
        manifest: null,
        generated: [],
        unprotected: [],
        warnings: [],
        failures: [{
          field: "manifest",
          message: `No commit in ${ref} has a subject beginning "${taskId}", so there is no history to build a manifest from. Either the work never landed, or it landed under commit messages that do not name the task \u2014 and in the second case nothing here can tell which files were its. Close it from its branch, or say why it cannot be.`
        }]
      };
    }
    const branch = branchOf(root, taskId);
    const strays = branch ? shas.filter((sha) => !reachableFrom(root, sha, branch)) : shas;
    manifest = buildHistoryManifest(root, taskId, shas);
    log(`  ${manifest.files.length} file(s) across ${shas.length} commit(s) in ${ref} whose subject names ${taskId}`);
    if (strays.length) {
      notes.push({
        field: "manifest",
        message: `${strays.length} of ${shas.length} attributed commit(s) are not on ` + (branch ? `"${branch}", the branch this task's record names` : "any branch \u2014 the record names none") + `:
${strays.map((s) => `      ${s.slice(0, 8)} ${subjectOf(root, s).slice(0, 88)}`).join("\n")}
    Read them. A second branch for the same task is fine; a commit describing different work means two tasks share this id, and closing would put the wrong diff in the audit record (D-49).`
      });
    }
    log("  attributed by commit subject, not by branch topology \u2014 a commit that omitted its task id is invisible here");
  } else {
    const fork = forkPoint(root, opts.base);
    manifest = buildManifest(root, fork.sha);
    log(`  ${manifest.files.length} file(s) changed since ${fork.sha.slice(0, 8)} \u2014 ${fork.how}`);
    if (!manifest.files.length && ref && alreadyMerged(root, ref)) {
      const shas = historyCommits(root, taskId, ref);
      early.push({
        field: "manifest",
        message: `Nothing has changed since the fork point, and this branch is already in ${ref} \u2014 so the diff is empty because the work is behind you, not because there was none. Closing on this manifest would check nothing. ` + (shas.length ? `${shas.length} commit(s) in ${ref} name ${taskId}: re-run with \`--from-history\` to verify against those.` : `No commit in ${ref} names ${taskId} in its subject either, so there is nothing to verify against here.`)
      });
    }
  }
  const grant = grantOnDisk(root, taskId);
  const declared = grant.kind === "grant" ? grant.zones : null;
  const extra = [];
  if (grant.kind === "none") {
    extra.push({
      field: "manifest",
      message: "No local grant, so the declared-zones check did not run here \u2014 it runs at the transition, against the board's copy of the spec. Everything else below was checked."
    });
  } else if (grant.kind === "unreadable") {
    extra.push({
      field: "grant",
      message: `The grant at .zones/state/grants/${taskId}.json exists but is not readable JSON, so the declared-zones check did not run here \u2014 it runs at the transition. \`cycle sync\` rewrites the grant.`
    });
  } else if (declared.length === 0) {
    log("  the grant on disk opens no protected zones");
    extra.push({
      field: "grant",
      message: "The grant on disk opens zero protected zones, so any change inside one will refuse as undeclared. That is correct if this task declared none \u2014 if the board says otherwise, the grant is stale: run `cycle sync` and verify again."
    });
  } else {
    log(`  declared, from the grant: ${declared.map((z) => `${z.id}:${z.mode}`).join(", ")}`);
  }
  const { failures, warnings } = checkClosing({
    task: {
      id: taskId,
      affected_zones: declared ?? parsed.value.zones.map((z) => ({ id: z.id, mode: "write" })),
      quality_gate: "none"
    },
    zones: parsed.value.zones.map((z) => ({
      zone_id: z.id,
      name: z.name,
      risk: z.risk,
      owner: z.owner,
      paths: z.paths,
      default_policy: z.default_policy,
      secrets: z.secrets ?? false
    })),
    generated: parsed.value.generated,
    unprotected: parsed.value.unprotected,
    manifest,
    mutated: mutatedPaths(root),
    evidence: opts.evidence ?? []
  });
  return {
    ok: failures.length === 0 && early.length === 0,
    taskId,
    manifest,
    generated: parsed.value.generated,
    unprotected: parsed.value.unprotected,
    // First, because it is the reason the rest of the answer is not worth much.
    failures: [...early, ...failures],
    warnings: [...notes, ...extra, ...warnings]
  };
}

// src/sync.ts
import { existsSync as existsSync20, mkdirSync as mkdirSync11, readFileSync as readFileSync24, renameSync, rmSync as rmSync5, writeFileSync as writeFileSync17 } from "node:fs";
import { dirname as dirname12, join as join27 } from "node:path";
async function mirrorTaskEvents(input) {
  const doFetch = input.fetchImpl ?? fetch;
  const logPath = join27(input.root, ".zones", "state", "events", `${input.taskId}.jsonl`);
  if (!existsSync20(logPath)) return { pushed: 0 };
  const lines = readFileSync24(logPath, "utf8").split("\n").filter((l) => l.trim());
  const events = lines.flatMap((l) => {
    try {
      return [JSON.parse(l)];
    } catch {
      return [];
    }
  });
  if (!events.length) return { pushed: 0 };
  let res;
  try {
    res = await doFetch(`${input.base}/tasks/${input.taskId}/events`, {
      method: "POST",
      headers: input.headers,
      body: JSON.stringify({ events })
    });
  } catch (err) {
    return { pushed: 0, warning: `could not mirror events (${err.message})` };
  }
  if (!res.ok) return { pushed: 0, warning: `could not mirror events (${res.status})` };
  return { pushed: events.length };
}
async function runSync(opts) {
  const { root, apiUrl, token, tenant, repo } = opts;
  const rawFetch = opts.fetchImpl ?? fetch;
  const log = opts.log ?? (() => {
  });
  const warnings = [];
  const base = `${apiUrl.replace(/\/+$/, "")}/v1/${tenant}/${repo}`;
  const headers = boardHeaders(token);
  const doFetch = async (input, init) => {
    try {
      return await rawFetch(input, init);
    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), { status: 503 });
    }
  };
  const branch = currentBranch(root);
  const taskId = taskIdFrom(branch);
  let boardSaw = false;
  let zonesPushed = 0;
  let zoneLines = null;
  const zonesPath = join27(root, ".zones", "zones.yml");
  if (existsSync20(zonesPath)) {
    const parsed = parseZonesFile(readFileSync24(zonesPath, "utf8"));
    if (!parsed.ok) {
      warnings.push(`zones.yml is invalid, so it was not synced: ${parsed.issues[0]?.message}`);
    } else {
      zoneLines = parsed.value.zones.map((z) => ({
        id: z.id,
        name: z.name,
        paths: z.paths,
        default_policy: z.default_policy
      }));
      const zones = parsed.value.zones.map((z) => ({
        zone_id: z.id,
        name: z.name,
        risk: z.risk,
        owner: z.owner,
        paths: z.paths,
        default_policy: z.default_policy,
        secrets: z.secrets
      }));
      const res = await doFetch(`${base}/zones`, { method: "PUT", headers, body: JSON.stringify({ zones }) });
      if (res.ok) {
        boardSaw = true;
        zonesPushed = zones.length;
        log(`  pushed ${zones.length} zone(s)`);
      } else warnings.push(`could not push the zone map (${res.status})`);
    }
  }
  {
    const res = await doFetch(`${base}/failure-policy`, { headers });
    if (res.ok) {
      try {
        const { policy } = await res.json();
        const value = policy === "reads" || policy === "journal" ? policy : "closed";
        const target = join27(root, ".zones", "state", "failure-policy");
        const current = existsSync20(target) ? readFileSync24(target, "utf8").trim() : null;
        if (current !== value) {
          mkdirSync11(dirname12(target), { recursive: true });
          const tmp = `${target}.tmp`;
          writeFileSync17(tmp, `${value}
`);
          renameSync(tmp, target);
          log(`  failure policy: ${value} \u2014 what the hook's wrapper honors when the core is down`);
        }
      } catch {
        warnings.push("the failure policy could not be read \u2014 the local one was left alone");
      }
    }
  }
  {
    const res = await doFetch(`${base}/pr-policy`, { headers });
    if (res.ok) {
      try {
        const { pr_open } = await res.json();
        const value = pr_open === true ? "on" : "off";
        const target = join27(root, ".zones", "state", "pr-policy");
        const current = existsSync20(target) ? readFileSync24(target, "utf8").trim() : null;
        if (current !== value) {
          mkdirSync11(dirname12(target), { recursive: true });
          const tmp = `${target}.tmp`;
          writeFileSync17(tmp, `${value}
`);
          renameSync(tmp, target);
          log(`  pr.open: ${value} \u2014 whether cc_submit opens this repo's task PRs (the hook honors it for the branch push)`);
        }
      } catch {
        warnings.push("the pr policy could not be read \u2014 the local one was left alone");
      }
    }
  }
  let eventsPushed = 0;
  if (taskId) {
    const mirrored = await mirrorTaskEvents({ root, base, headers, taskId, fetchImpl: doFetch });
    if (mirrored.pushed) {
      boardSaw = true;
      eventsPushed = mirrored.pushed;
      log(`  mirrored ${mirrored.pushed} event(s)`);
    }
    if (mirrored.warning) warnings.push(mirrored.warning);
  }
  let grantState = "none";
  let live = null;
  if (!taskId) {
    warnings.push(
      branch ? `"${branch}" is not a task branch, so there is no grant to fetch.` : "no branch, so no task and no grant."
    );
  } else {
    const res = await doFetch(`${base}/tasks/${taskId}/grant`, { headers });
    const drift = replyDrift(res);
    if (drift) warnings.push(`protocol: ${drift}`);
    if (res.ok) boardSaw = true;
    if (res.status === 404 && !boardSaw) {
      boardSaw = (await doFetch(`${base}/tasks/${taskId}`, { headers })).ok;
    }
    if (res.status === 404 && !boardSaw) {
      const who = savedIdentity(apiUrl);
      warnings.push(
        `this board answered 404 to everything \u2014 signed in as ${who ?? "nobody (`cycle login` has not run here)"}, so either ${tenant}/${repo} does not exist or that identity is not a member of it. Nothing local was touched.`
      );
    } else if (res.status === 404) {
      const stale = join27(root, ".zones", "state", "grants", `${taskId}.json`);
      if (existsSync20(stale)) {
        rmSync5(stale, { force: true });
        grantState = "revoked";
        log(`  removed the grant for ${taskId} \u2014 the board has revoked it`);
      } else {
        warnings.push(`${taskId} has no grant \u2014 it has not passed the gate yet.`);
      }
    } else if (!res.ok) {
      warnings.push(`could not fetch the grant (${res.status}) \u2014 the local grant was left alone`);
    } else {
      const { grant } = await res.json();
      const target = join27(root, ".zones", "state", "grants", `${taskId}.json`);
      const next = JSON.stringify(grant, null, 2) + "\n";
      const current = existsSync20(target) ? readFileSync24(target, "utf8") : null;
      if (current === next) {
        grantState = "unchanged";
      } else {
        mkdirSync11(dirname12(target), { recursive: true });
        const tmp = `${target}.tmp`;
        writeFileSync17(tmp, next);
        renameSync(tmp, target);
        grantState = "written";
        const ranOut = Number.isFinite(Date.parse(grant.expires)) && Date.parse(grant.expires) <= Date.now();
        log(ranOut ? `  the grant for ${taskId} is already expired (${grant.expires}) \u2014 written, but nothing is open until it is renewed at the gate` : `  wrote the grant for ${taskId}`);
      }
    }
  }
  if (taskId) {
    try {
      live = JSON.parse(readFileSync24(join27(root, ".zones", "state", "grants", `${taskId}.json`), "utf8"));
    } catch {
      live = null;
    }
  }
  let reconciled = { status: "skipped", adopted: [], written: [], grantsRemoved: [], collided: [] };
  if (opts.reconcile !== false && boardSaw) {
    reconciled = await runReconcile({
      root,
      base,
      headers,
      taskId,
      fetchImpl: doFetch,
      log,
      warn: (w) => warnings.push(w)
    });
  }
  const scan = scanPlaybooks(root);
  if (scan) {
    warnings.push(...scan.warnings);
    if (writePlaybooksReadme(root, scan) === "updated") {
      recordOwnWrites(root, taskId, [join27(".zones", "playbooks", "README.md")]);
      log("  .zones/playbooks/README.md regenerated from the playbook files");
    }
  }
  const archivedTopics = new Set(
    (scan?.books ?? []).filter((b) => b.status === "archived").map((b) => b.topic)
  );
  const driver = ensureMergeDriver(root);
  if (driver.status === "registered") {
    log(`  merge driver wired for this clone \u2014 merge.cc-agents.driver was unset (CC-543/CC-590)`);
  } else if (driver.status === "failed") {
    warnings.push("the cc-agents merge driver could not be registered \u2014 `cycle doctor` has the one-liner");
  }
  const healed = healAgentsFile(root);
  if (healed.changed) {
    recordOwnWrites(root, taskId, ["AGENTS.md"]);
    const parts = [
      healed.resolvedHunks ? `${healed.resolvedHunks} cc-only conflict hunk(s) resolved to this side` : null,
      healed.collapsedBlocks ? `${healed.collapsedBlocks} stacked block(s) collapsed` : null,
      healed.placeholdersRemoved ? `${healed.placeholdersRemoved} stray placeholder(s) removed` : null
    ].filter(Boolean).join(", ");
    log(`  AGENTS.md healed \u2014 ${parts || "normalised"}`);
    if (healed.resolvedHunks) {
      warnings.push("AGENTS.md conflict hunks were resolved in the working tree \u2014 review, then `git add AGENTS.md` if a merge is in flight");
    }
  }
  if (healed.humanHunks) {
    warnings.push(`AGENTS.md still carries ${healed.humanHunks} genuine conflict hunk(s) outside the cc block \u2014 those are yours to resolve`);
  }
  if (healed.unbalanced) {
    warnings.push("AGENTS.md has unbalanced cc:begin/cc:end markers \u2014 fix them by hand; nothing structural was touched");
  }
  let agents = "skipped";
  if (zoneLines) {
    let task;
    if (taskId && live) {
      let spec = {};
      let specFailed = false;
      try {
        const r = await doFetch(`${base}/tasks/${taskId}`, { headers });
        if (r.ok) spec = (await r.json()).task ?? {};
        else {
          specFailed = true;
          warnings.push(`could not read ${taskId} (${r.status}) \u2014 the context block has the grant but not the spec`);
        }
      } catch {
        specFailed = true;
        warnings.push("could not read the task spec \u2014 the context block has the grant but not the spec");
      }
      if (specFailed) {
        const rec = readTaskRecord(root, taskId);
        if (rec) {
          spec.title ??= rec.title;
          spec.topics ??= rec.topics;
          warnings.push(`title and topics recovered from the record file (.zones/tasks/${taskId}.md)`);
        }
      }
      task = {
        id: taskId,
        title: spec.title ?? taskId,
        branch: live.branch ?? branch ?? taskId,
        goal: spec.goal ?? null,
        non_goals: spec.non_goals ?? null,
        open: live.zones ?? [],
        expires: live.expires,
        // Archived playbooks stay for history and are never pointed at
        // (docs/07 Rule 3) — the loader's half of the death state.
        topics: (spec.topics ?? []).filter((t) => !archivedTopics.has(t))
      };
    }
    const enforcement = detectEnforcement(root);
    const board2 = readBoardBinding(root);
    const durable = writeAgentsBlock(root, renderDurableBlock({ zones: zoneLines, board: board2, enforcement }));
    if (durable.changed) {
      recordOwnWrites(root, taskId, ["AGENTS.md"]);
      log("  AGENTS.md \u2014 the durable zone map was refreshed");
    }
    const local = task ? writeLocalBlock(root, renderEphemeralBlock({
      zones: zoneLines,
      task,
      playbookExists: playbookReader(root),
      enforcement
    })) : clearLocalBlock(root);
    agents = durable.changed || local.changed ? "updated" : "unchanged";
    if (local.changed) {
      log(task ? `  CLAUDE.local.md now names ${taskId} and what is open to it` : "  CLAUDE.local.md cleared \u2014 no task is active");
    }
  }
  const mentions = [];
  if (taskId && boardSaw) {
    try {
      const res = await doFetch(`${base}/tasks/${taskId}/mentions`, { headers });
      if (res.ok) {
        const body = await res.json();
        for (const m of body.mentions ?? []) {
          mentions.push(`${m.reason} (from ${m.actor}, ${m.t})`);
        }
        if (mentions.length) {
          log(`  ${mentions.length} unacknowledged mention(s) \u2014 advisory, nothing is blocked:`);
          for (const line of mentions) log(`    ${line}`);
          log("    A checkout named above is claimed, not verified \u2014 `git worktree list --porcelain` settles it.");
          log("    `cycle ack` discharges one \u2014 it closes the warning and opens nothing.");
        }
      }
    } catch {
    }
  }
  return { taskId, zonesPushed, eventsPushed, grant: grantState, agents, mentions, reconciled, warnings };
}

// src/close.ts
async function runClose(opts) {
  const { root, apiUrl, token, tenant, repo, actor } = opts;
  const doFetch = opts.fetchImpl ?? fetch;
  const log = opts.log ?? (() => {
  });
  const local = runVerify({ root, base: opts.base, evidence: opts.evidence, fromHistory: opts.fromHistory, taskId: opts.taskId, log });
  if (!local.ok || !local.taskId || !local.manifest) {
    const failures = [...local.failures];
    if (opts.override) {
      failures.push({
        field: "override",
        message: "Your --override was not applied: it is recorded by the board with the transition, and the checks above run here, before the board is asked. Fix what they name, or take it up with the check \u2014 an override cannot answer a local refusal."
      });
    }
    return { ok: false, taskId: local.taskId, failures, warnings: local.warnings };
  }
  const base = `${apiUrl.replace(/\/+$/, "")}/v1/${tenant}/${repo}`;
  const headers = boardHeaders(token);
  const mirrored = await mirrorTaskEvents({ root, base, headers, taskId: local.taskId, fetchImpl: doFetch });
  if (mirrored.pushed) log(`  mirrored ${mirrored.pushed} event(s)`);
  if (mirrored.warning) local.warnings.push({ field: "events", message: mirrored.warning });
  const res = await doFetch(`${base}/tasks/${local.taskId}/transition`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      to: "Done",
      actor,
      manifest: local.manifest,
      generated: local.generated,
      unprotected: local.unprotected,
      evidence: opts.evidence ?? [],
      override: opts.override
    })
  });
  const drift = replyDrift(res);
  if (drift) local.warnings.push({ field: "protocol", message: drift });
  const upgrade = await upgradeRequired(res);
  if (upgrade) {
    return {
      ok: false,
      taskId: local.taskId,
      warnings: local.warnings,
      failures: [{ field: "protocol", message: upgrade }]
    };
  }
  if (res.status === 422) {
    const body2 = await res.json().catch(() => ({}));
    return { ok: false, taskId: local.taskId, failures: body2.failures ?? [], warnings: local.warnings };
  }
  if (!res.ok) {
    return {
      ok: false,
      taskId: local.taskId,
      warnings: local.warnings,
      failures: [{ field: "network", message: `The board answered ${res.status}. Nothing was closed.` }]
    };
  }
  const body = await res.json();
  let auditPath;
  if (body.audit) {
    auditPath = join28(".zones", "audit", `${local.taskId}.md`);
    const full = join28(root, auditPath);
    mkdirSync12(dirname13(full), { recursive: true });
    const written = [auditPath];
    if (existsSync21(full) && readFileSync25(full, "utf8") !== body.audit) {
      const kept = `${auditPath}.superseded`;
      writeFileSync18(join28(root, kept), readFileSync25(full, "utf8"));
      written.push(kept);
      log(`  an audit record was already here \u2014 kept as ${kept}`);
      local.warnings.push({
        field: "audit",
        message: `${local.taskId} already had an audit record and it differed. The previous one is at ${kept}; read both before deleting either \u2014 a task that closes twice usually means its id or its board changed.`
      });
    }
    writeFileSync18(full, body.audit);
    recordOwnWrites(root, local.taskId, written);
    log(`  wrote ${auditPath}`);
    if (opts.override) {
      if (/\noverride:\n/.test(body.audit)) {
        log(`  the override is in it \u2014 signed by ${opts.override.by}, recorded as an exception and not as a pass`);
      } else {
        local.warnings.push({
          field: "override",
          message: `the board applied your --override but ${auditPath} does not carry it \u2014 this board renders audit records without the override block, so the receipt does not say who signed this close. Restart the board from a current build, or write the signature and the reason into the record by hand before committing it.`
        });
      }
    }
  }
  return { ok: true, taskId: local.taskId, failures: [], warnings: local.warnings, auditPath };
}
function parseEvidence(values, by, at2 = (/* @__PURE__ */ new Date()).toISOString()) {
  return values.map((value) => ({
    kind: /^https?:\/\//.test(value) ? "url" : "capture",
    value,
    by,
    at: at2
  }));
}
var missingCapture = (root, e) => e.kind === "capture" && !existsSync21(join28(root, e.value));

// src/start.ts
import { execFileSync as execFileSync11 } from "node:child_process";
import { existsSync as existsSync22, mkdirSync as mkdirSync13, readFileSync as readFileSync26, writeFileSync as writeFileSync19 } from "node:fs";
import { dirname as dirname14, join as join29 } from "node:path";
var slug2 = (title) => title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40);
function uncommittedTracked(root) {
  try {
    return execFileSync11("git", ["status", "--porcelain"], { cwd: root, stdio: "pipe" }).toString().split("\n").filter((l) => l.trim() && !l.startsWith("??")).map((l) => l.trim());
  } catch {
    return [];
  }
}
function boardRefusal(status, body) {
  const said = [body.error, body.message].find((v) => typeof v === "string" && v.trim().length > 0)?.trim();
  return said ? `the board could not start the task: ${said} (it answered ${status})` : `the board could not start the task \u2014 it answered ${status} and gave no reason`;
}
async function runStart(input) {
  const { root, apiUrl, tenant, repo, token, actor } = input;
  const dirty = uncommittedTracked(root);
  if (dirty.length) {
    return {
      started: false,
      taskId: input.taskId ?? "\u2014",
      branch: null,
      failures: [{
        field: "working tree",
        message: `${dirty.length} uncommitted change(s) would be carried onto the new branch, and would then look like work belonging to this task:
  ` + dirty.slice(0, 8).join("\n  ") + (dirty.length > 8 ? `
  \u2026 and ${dirty.length - 8} more` : "") + "\n\nCommit them, or `git stash`, then start again. Nothing was filed and no branch was created."
      }]
    };
  }
  const doFetch = input.fetchImpl ?? fetch;
  const base = `${apiUrl.replace(/\/+$/, "")}/v1/${tenant}/${repo}`;
  const headers = boardHeaders(token);
  const call2 = async (path, method, body) => {
    const res = await doFetch(`${base}${path}`, {
      method,
      headers,
      body: body === void 0 ? void 0 : JSON.stringify(body)
    });
    const parsed = await res.json().catch(() => ({}));
    if (res.status === 426) throw new Error(parsed.error ?? "the board requires a newer CLI (426) \u2014 upgrade and retry");
    return { status: res.status, body: parsed };
  };
  const mustSucceed = (step, r) => {
    if (r.status >= 200 && r.status < 300) return;
    const said = r.body.failures?.map((f) => f.message).join(" ") ?? r.body.error ?? `the board answered ${r.status}`;
    throw new Error(`${step}: ${said}`);
  };
  let taskId;
  let title;
  let state;
  let boundBranch;
  let onBoard;
  if (input.taskId) {
    const got = await call2(`/tasks/${input.taskId}`, "GET");
    mustSucceed(`reading ${input.taskId}`, got);
    taskId = String(got.body.task.id);
    title = input.title ?? String(got.body.task.title ?? taskId);
    state = got.body.task.state;
    boundBranch = got.body.task.branch ?? void 0;
    onBoard = got.body.task;
  } else {
    const intake2 = await call2("/tasks", "POST", { title: input.title, requested_by: actor });
    mustSucceed("filing the task", intake2);
    taskId = intake2.body.task.id;
    title = input.title;
    state = "Triage";
  }
  const patch = input.taskId ? {
    ...input.goal !== void 0 ? { goal: input.goal } : {},
    ...input.nonGoals !== void 0 ? { non_goals: input.nonGoals } : {},
    ...input.criteria.length ? { acceptance_criteria: input.criteria } : {},
    ...input.zones.length ? { affected_zones: input.zones } : {},
    ...input.topics.length ? { topics: input.topics } : {},
    ...input.gate !== void 0 ? { quality_gate: input.gate } : {},
    ...input.priority !== void 0 ? { priority: input.priority } : {}
  } : {
    goal: input.goal,
    non_goals: input.nonGoals,
    affected_zones: input.zones,
    acceptance_criteria: input.criteria,
    quality_gate: input.gate ?? "none",
    topics: input.topics,
    priority: input.priority ?? "none"
  };
  if (Object.keys(patch).length) {
    const scoped = await call2(`/tasks/${taskId}`, "PUT", patch);
    mustSucceed(`scoping ${taskId}`, scoped);
  }
  const branch = boundBranch ?? `task/${taskId}-${slug2(title)}`;
  const exists = () => {
    try {
      execFileSync11("git", ["rev-parse", "--verify", `refs/heads/${branch}`], { cwd: root, stdio: "pipe" });
      return true;
    } catch {
      return false;
    }
  };
  const repointed = (() => {
    if (!exists()) return false;
    try {
      execFileSync11("git", ["merge-base", "--is-ancestor", branch, "HEAD"], { cwd: root, stdio: "pipe" });
      const tip = execFileSync11("git", ["rev-parse", branch], { cwd: root, stdio: "pipe" }).toString().trim();
      const head = execFileSync11("git", ["rev-parse", "HEAD"], { cwd: root, stdio: "pipe" }).toString().trim();
      if (tip === head) return false;
      execFileSync11("git", ["branch", "-f", branch, "HEAD"], { cwd: root, stdio: "pipe" });
      return true;
    } catch {
      return false;
    }
  })();
  execFileSync11("git", exists() ? ["checkout", branch] : ["checkout", "-b", branch], { cwd: root, stdio: "pipe" });
  if (repointed) {
    console.error(`  note: ${branch} pointed at history HEAD already contains \u2014 re-pointed to HEAD instead of rewinding the checkout`);
  }
  const hop = state === "Triage" ? await call2(`/tasks/${taskId}/transition`, "POST", { to: "Todo", actor }) : void 0;
  const boardState = hop && hop.status >= 200 && hop.status < 300 ? "Todo" : state ?? "Todo";
  const gate = await call2(`/tasks/${taskId}/transition`, "POST", {
    to: "In Progress",
    actor,
    branch,
    // The checkout this task is being started from (CC-50). `root` is the git
    // top-level (`git rev-parse --show-toplevel`, resolved once in index.ts),
    // so the grant records the directory that holds it — right for a linked
    // worktree by construction, and a fact git answers rather than one the
    // agent sets (CC-51).
    holder_path: root
  });
  const today = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
  const refused = gate.status !== 200 || gate.body.ok === false;
  const declaredTopics = input.topics.length ? input.topics : onBoard?.topics ?? [];
  writeRecord(root, {
    taskId,
    // The board's title when adopting: a record named differently from the
    // task it records is the drift `cycle doctor` already counts twelve of.
    title,
    /* A refusal reports the state the board actually holds, never an invented
       one. This read `refused ? 'Todo' : 'In Progress'`, so a start refused
       against a task the board held In Review rewrote its record to Todo —
       and because the record is rendered rather than amended, that took the
       Result section and the ticked criteria with it (CC-462). */
    state: refused ? boardState : "In Progress",
    branch,
    /* A field nobody typed is not a field somebody cleared — the same rule the
       patch above already follows, applied to the file it forgot. */
    topics: declaredTopics,
    gate: input.gate ?? onBoard?.quality_gate ?? "none",
    priority: input.priority ?? onBoard?.priority ?? "none",
    goal: input.goal ?? onBoard?.goal ?? void 0,
    nonGoals: input.nonGoals ?? onBoard?.non_goals ?? void 0,
    zones: input.zones.length ? input.zones : onBoard?.affected_zones ?? [],
    criteria: input.criteria.length ? input.criteria : onBoard?.acceptance_criteria ?? [],
    actor,
    today,
    refused
  });
  recordOwnWrites(root, taskId, [join29(".zones", "tasks", `${taskId}.md`)]);
  if (refused) {
    const gateFailures = gate.body.failures ?? [];
    if (gateFailures.length) {
      return { started: false, taskId, branch, failures: gateFailures };
    }
    return {
      started: false,
      taskId,
      branch,
      failures: [{ field: "board", message: boardRefusal(gate.status, gate.body) }],
      boardError: true
    };
  }
  if (input.syncAfter !== false) {
    await runSync({ root, apiUrl, token, tenant, repo, fetchImpl: input.fetchImpl, reconcile: false });
  }
  const scan = scanPlaybooks(root);
  const byTopic = new Map((scan?.books ?? []).map((b) => [b.topic, b]));
  const playbooks = [];
  const topicWarnings = [];
  for (const t of declaredTopics) {
    if (byTopic.get(t)?.status === "archived") {
      topicWarnings.push(`topic "${t}" is archived \u2014 its playbook stays for history and no longer loads`);
    } else if (existsSync22(join29(root, ".zones", "playbooks", `${t}.md`))) {
      playbooks.push(`.zones/playbooks/${t}.md`);
    } else {
      topicWarnings.push(`topic "${t}" has no playbook \u2014 nothing to load (the birth rule: no cited content, no topic)`);
    }
  }
  const grant = gate.body.grant ?? {};
  return {
    started: true,
    taskId,
    branch,
    open: grant.zones ?? [],
    expires: grant.expires ?? null,
    playbooks,
    topicWarnings
  };
}
function priorRecord(root, taskId) {
  const path = join29(root, ".zones", "tasks", `${taskId}.md`);
  if (!existsSync22(path)) return { history: [] };
  let text;
  try {
    text = readFileSync26(path, "utf8");
  } catch {
    return { history: [] };
  }
  const created = /^created:\s*(\S+)\s*$/m.exec(text)?.[1];
  const history = [];
  for (const line of text.split("\n")) {
    const row = /^\|\s*(\d{4}-\d{2}-\d{2})\s*\|\s*([^|]*?)\s*\|\s*(.*?)\s*\|$/.exec(line.trim());
    if (row) history.push([row[1], row[2], row[3]]);
  }
  return { created, history, text };
}
var RENDERED_HEADINGS = /* @__PURE__ */ new Set(["## Goal", "## Non-goals", "## Affected zones", "## Acceptance criteria", "## History"]);
function sectionsOf(text) {
  const out = [];
  let cur = null;
  for (const line of text.split("\n")) {
    if (line.startsWith("## ")) {
      if (cur) out.push({ heading: cur.heading, body: cur.body.join("\n") });
      cur = { heading: line.trim(), body: [] };
    } else if (cur) cur.body.push(line);
  }
  if (cur) out.push({ heading: cur.heading, body: cur.body.join("\n") });
  return out;
}
function amendRendered(rendered, prior) {
  if (!prior) return rendered;
  const ticked = new Set(
    (sectionsOf(prior).find((s) => s.heading === "## Acceptance criteria")?.body ?? "").split("\n").map((l) => /^- \[[xX]\]\s+(.*)$/.exec(l.trim())?.[1]).filter((t) => Boolean(t))
  );
  let out = ticked.size ? rendered.split("\n").map((l) => {
    const m = /^- \[ \]\s+(.*)$/.exec(l.trim());
    return m && ticked.has(m[1]) ? l.replace("- [ ]", "- [x]") : l;
  }).join("\n") : rendered;
  const carried = sectionsOf(prior).filter((s) => !RENDERED_HEADINGS.has(s.heading));
  if (carried.length) {
    const block = carried.map((s) => `${s.heading}
${s.body}`.replace(/\n+$/, "")).join("\n\n");
    const at2 = out.indexOf("\n---\n\n## History");
    out = at2 === -1 ? `${out.replace(/\n+$/, "")}

${block}
` : `${out.slice(0, at2)}

${block}
${out.slice(at2)}`;
  }
  return out;
}
function writeRecord(root, r) {
  const prior = priorRecord(root, r.taskId);
  const now = r.refused ? [r.today, r.state, "**Gate refused In Progress** \u2014 see the failures printed at start; branch kept"] : [r.today, "In Progress", "Gate passed; grant bound to this branch"];
  const last = prior.history[prior.history.length - 1];
  const repeats = last && last[0] === now[0] && last[1] === now[1] && last[2] === now[2];
  const history = prior.history.length ? repeats ? prior.history : [...prior.history, now] : [
    [r.today, "Triage", "`cycle start`"],
    [r.today, "Todo", "Scoped in the same command"],
    now
  ];
  const body = renderTaskRecord({
    id: r.taskId,
    title: r.title,
    state: r.state,
    owner: r.actor,
    branch: r.branch,
    goal: r.goal,
    non_goals: r.nonGoals,
    affected_zones: r.zones,
    acceptance_criteria: r.criteria,
    topics: r.topics,
    priority: r.priority,
    quality_gate: r.gate,
    created: prior.created ?? r.today,
    writtenBy: "Record written at birth by `cycle start` (CC-111) \u2014 the D-43 orphan pattern\nends where this command begins.",
    history
  });
  const recordPath = join29(root, ".zones", "tasks", `${r.taskId}.md`);
  mkdirSync13(dirname14(recordPath), { recursive: true });
  writeFileSync19(recordPath, amendRendered(body, prior.text));
}

// src/scope.ts
var SCOPABLE = [
  "title",
  "goal",
  "non_goals",
  "acceptance_criteria",
  "affected_zones",
  "quality_gate",
  "mode",
  "topics",
  "priority"
];
async function runScope(opts) {
  const { apiUrl, token, tenant, repo, taskId } = opts;
  const doFetch = opts.fetchImpl ?? fetch;
  const warnings = [];
  const unknown = Object.keys(opts.patch).filter((k) => !SCOPABLE.includes(k));
  if (unknown.length) {
    return {
      ok: false,
      taskId,
      warnings,
      failures: [{
        field: unknown[0],
        message: `cycle scope does not write ${unknown.join(", ")}. ` + (unknown.includes("state") ? "A task moves through the gate and nowhere else \u2014 `cycle start`, `cycle submit` and `cycle pause` are the edges (E15)." : `It writes ${SCOPABLE.join(", ")}.`)
      }]
    };
  }
  if (!Object.keys(opts.patch).length) {
    return {
      ok: false,
      taskId,
      warnings,
      failures: [{ field: "\u2014", message: 'Nothing to change. Name at least one field, e.g. --goal "\u2026".' }]
    };
  }
  const res = await doFetch(`${apiUrl.replace(/\/+$/, "")}/v1/${tenant}/${repo}/tasks/${taskId}`, {
    method: "PUT",
    headers: boardHeaders(token),
    body: JSON.stringify(opts.patch)
  });
  const drift = replyDrift(res);
  if (drift) warnings.push(drift);
  const tooOld = await upgradeRequired(res);
  if (tooOld) return { ok: false, taskId, warnings, failures: [{ field: "protocol", message: tooOld }] };
  if (!res.ok) {
    const body2 = await res.json().catch(() => ({}));
    const failures = body2.failures?.map((f) => ({ field: f.field ?? "\u2014", message: f.message })) ?? [{ field: "\u2014", message: body2.error ?? `the board answered ${res.status}` }];
    return { ok: false, taskId, warnings, failures };
  }
  const body = await res.json();
  return { ok: true, taskId, task: body.task, warnings, failures: [] };
}

// src/decide.ts
import { existsSync as existsSync23, readFileSync as readFileSync27 } from "node:fs";
import { join as join30 } from "node:path";
var pendingRequests = (opts) => boardCall(opts, "/access-requests?state=pending");
var decideRequest = (opts, id, state, decidedBy, ttlHours) => boardCall(opts, `/access-requests/${id}/resolve`, {
  method: "POST",
  body: JSON.stringify({ state, decided_by: decidedBy, ttl_hours: ttlHours, channel: "session" })
});
function formatRequest(r, zoneName, owner) {
  return [
    `${r.id}  ${zoneName ?? r.zone_id} \xB7 ${r.mode}  \u2014  ${r.task_id}`,
    `  asked by ${r.requested_by}${owner ? `, owned by ${owner}` : ""}`,
    `  why:  ${r.reason}`,
    `  else: ${r.alternative}`
  ].join("\n");
}
function zoneOwners(root) {
  const path = join30(root, ".zones", "zones.yml");
  if (!existsSync23(path)) return /* @__PURE__ */ new Map();
  const parsed = parseZonesFile(readFileSync27(path, "utf8"));
  if (!parsed.ok) return /* @__PURE__ */ new Map();
  return new Map(parsed.value.zones.map((z) => [z.id, { name: z.name, owner: z.owner }]));
}

// src/mentions.ts
var openMentions = (opts, taskId) => boardCall(opts, `/tasks/${encodeURIComponent(taskId)}/mentions`);
var ackMention = (opts, taskId, mentionT) => boardCall(opts, `/tasks/${encodeURIComponent(taskId)}/mentions/ack`, {
  method: "POST",
  body: JSON.stringify({ mention_t: mentionT })
});
function formatMention(m) {
  return `${m.t}
  ${m.reason}
  from ${m.actor}`;
}

// src/show.ts
async function runShow(opts) {
  const { apiUrl, token, tenant, repo, taskId } = opts;
  const doFetch = opts.fetchImpl ?? fetch;
  const warnings = [];
  const base = `${apiUrl.replace(/\/+$/, "")}/v1/${tenant}/${repo}`;
  const res = await doFetch(`${base}/tasks${taskId ? `/${taskId}` : ""}`, { headers: boardHeaders(token) });
  const drift = replyDrift(res);
  if (drift) warnings.push(drift);
  const tooOld = await upgradeRequired(res);
  if (tooOld) return { ok: false, warnings, failures: [{ field: "protocol", message: tooOld }] };
  if (!res.ok) {
    const body2 = await res.json().catch(() => ({}));
    return {
      ok: false,
      warnings,
      failures: [{
        field: taskId ?? "\u2014",
        message: body2.error ?? (res.status === 404 ? `no task ${taskId} on ${tenant}/${repo}` : `the board answered ${res.status}`)
      }]
    };
  }
  const body = await res.json();
  return { ok: true, task: body.task, tasks: body.tasks, warnings, failures: [] };
}
var num = (id) => Number(/-(\d+)$/.exec(String(id ?? ""))?.[1] ?? 0);
function formatTask(task) {
  const out = [];
  out.push(`${task.id}  ${task.state}${task.priority && task.priority !== "none" ? `  \xB7  ${task.priority}` : ""}`);
  out.push(task.title ?? "");
  const zones = task.affected_zones ?? [];
  const meta = [
    task.mode && task.mode !== "standard" ? `mode ${task.mode}` : null,
    task.quality_gate && task.quality_gate !== "none" ? `gate ${task.quality_gate}` : null,
    task.topics?.length ? `topics ${task.topics.join(", ")}` : null,
    zones.length ? `zones ${zones.map((z) => `${z.id}:${z.mode}`).join(", ")}` : "no protected zones",
    task.branch ? `branch ${task.branch}` : null
  ].filter(Boolean);
  if (meta.length) out.push("", meta.join("  \xB7  "));
  const field = (label2, value) => {
    if (!value) return;
    out.push("", label2, String(value));
  };
  field("What should it do?", task.goal);
  field("What must it NOT do?", task.non_goals);
  if (task.acceptance_criteria?.length) {
    out.push("", "How will we know it worked?");
    for (const c of task.acceptance_criteria) out.push(`  - ${c}`);
  }
  const missing = [
    !task.goal && "what it should do",
    !task.non_goals && "what it must NOT do",
    !task.acceptance_criteria?.length && "how we know it worked"
  ].filter(Boolean);
  if (missing.length) out.push("", `Unanswered: ${missing.join(", ")}. The gate will refuse until they are.`);
  return out.join("\n");
}
function formatList(tasks) {
  if (!tasks.length) return "Nothing on the board.";
  const width = Math.max(...tasks.map((t) => String(t.state ?? "").length));
  return tasks.slice().sort((a, b) => num(a.id) - num(b.id)).map((t) => `${String(t.id).padEnd(8)} ${String(t.state ?? "").padEnd(width)}  ${t.title ?? ""}`).join("\n");
}

// src/deploy-guard.ts
import { execFileSync as execFileSync12 } from "node:child_process";
function currentBranch2(env = process.env, fromGit = gitBranch) {
  return env.CC_DEPLOY_BRANCH || env.WORKERS_CI_BRANCH || env.GITHUB_REF_NAME || env.VERCEL_GIT_COMMIT_REF || env.BRANCH || env.CI_COMMIT_REF_NAME || env.BUILDKITE_BRANCH || fromGit() || null;
}
var headIsTrunkTip = (trunk2) => {
  try {
    execFileSync12("git", ["fetch", "--quiet", "origin", trunk2], {
      stdio: ["ignore", "ignore", "ignore"],
      timeout: 2e4
    });
    const head = execFileSync12("git", ["rev-parse", "HEAD"], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"]
    }).trim();
    const tip = execFileSync12("git", ["rev-parse", `origin/${trunk2}`], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"]
    }).trim();
    return Boolean(head) && head === tip;
  } catch {
    return null;
  }
};
var gitBranch = () => {
  try {
    const name = execFileSync12("git", ["rev-parse", "--abbrev-ref", "HEAD"], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"]
    }).trim();
    return name && name !== "HEAD" ? name : null;
  } catch {
    return null;
  }
};
function decide2(input) {
  const trunk2 = input.trunk || "main";
  if (input.override) {
    return { action: "deploy", why: `CC_ALLOW_BRANCH_DEPLOY=1 \u2014 deploying "${input.branch ?? "unknown"}" on purpose` };
  }
  if (!input.branch) {
    return {
      action: "refuse",
      why: "Could not tell which branch this is, and a deploy that cannot name its own source is one nobody can audit later.\n  Set CC_DEPLOY_BRANCH, or CC_ALLOW_BRANCH_DEPLOY=1 if you mean to deploy anyway."
    };
  }
  if (input.branch !== trunk2) {
    if (input.atTrunkTip === true) {
      return {
        action: "deploy",
        why: `this is "${input.branch}", and its HEAD is exactly the tip of origin/${trunk2} (verified after fetch) \u2014 the bytes deploying are the trunk\u2019s`
      };
    }
    return {
      action: "skip",
      why: `this is "${input.branch}" and production deploys from "${trunk2}", so nothing was deployed.
  Merge it, push it to ${trunk2} \u2014 a checkout sitting exactly on origin/${trunk2}\u2019s tip deploys whatever its branch is called \u2014 or set CC_ALLOW_BRANCH_DEPLOY=1 on purpose.`
    };
  }
  return { action: "deploy", why: `on ${trunk2}` };
}
function runGuard(env = process.env, log = console.log, err = console.error, fromGit = gitBranch, tipCheck = headIsTrunkTip) {
  const trunk2 = env.CC_PRODUCTION_BRANCH || "main";
  const branch = currentBranch2(env, fromGit);
  const verdict = decide2({
    branch,
    trunk: trunk2,
    override: env.CC_ALLOW_BRANCH_DEPLOY === "1",
    // Only asked when the answer could change the verdict: the fetch costs a
    // round trip, and on the trunk itself the name already decides.
    atTrunkTip: branch && branch !== trunk2 ? tipCheck(trunk2) : null
  });
  if (verdict.action === "refuse") {
    err(`
  Refusing to deploy \u2014 ${verdict.why}
`);
    return 1;
  }
  if (verdict.action === "skip") {
    log(`
  Deploy skipped: ${verdict.why}
`);
    return 2;
  }
  log(`  deploy guard: ${verdict.why}`);
  return 0;
}

// src/help.ts
var VALUE_FLAGS = {
  login: ["--email"],
  pair: ["--board"],
  connect: ["--board"],
  approve: ["--hours"],
  start: ["--goal", "--non-goals", "--criteria", "--zone", "--topics", "--priority", "--gate"],
  scope: ["--title", "--goal", "--non-goals", "--criteria", "--zone", "--topics", "--priority", "--gate", "--mode", "--state"],
  pause: ["--reason"],
  "request-access": ["--zone", "--mode", "--reason", "--alternative"],
  verify: ["--base", "--evidence", "--override"],
  seed: ["--topics"],
  protect: ["--zone"],
  handoff: ["--closed", "--out"]
};
var KNOWN_FLAGS = {
  start: ["--goal", "--non-goals", "--criteria", "--zone", "--topics", "--priority", "--gate", "--help", "-h"],
  submit: ["--help", "-h"],
  // sync graduated here with its reconcile stage (CC-570): it deletes grant
  // files and writes record files now, so a mistyped flag must be refused, not
  // silently dropped in front of a command that repairs the vault.
  sync: ["--no-reconcile", "--help", "-h"],
  pause: ["--reason", "--help", "-h"],
  verify: ["--base", "--evidence", "--from-history", "--close", "--override", "--help", "-h"],
  // `--state` stays in the allowed set so it reaches runScope, whose refusal
  // names the gate and its edges (E15) — the dispatch's "not a flag this
  // command takes" would bury the better sentence. Recognised, then refused
  // with the reason, is not the same as accepted.
  scope: ["--title", "--goal", "--non-goals", "--criteria", "--zone", "--topics", "--priority", "--gate", "--mode", "--state", "--help", "-h"],
  // `handoff` is read-only until --out, and --out writes a file into the
  // working tree — a stray flag silently dropped there is a file written by a
  // command somebody believed meant something else (CC-580).
  handoff: ["--closed", "--out", "--offline", "--help", "-h"]
};
function wantsHelp(command, args) {
  const takesValue = new Set(VALUE_FLAGS[command] ?? []);
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === "--help" || a === "-h") return true;
    if (takesValue.has(a)) i++;
  }
  return false;
}
function positionalTaskId(command, args) {
  const takesValue = new Set(VALUE_FLAGS[command] ?? []);
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (takesValue.has(a)) {
      i++;
      continue;
    }
    if (/^[A-Z]+-\d+$/.test(a)) return a;
  }
  return void 0;
}
function unknownFlag(command, args) {
  const known = KNOWN_FLAGS[command];
  if (!known) return void 0;
  const allowed = new Set(known);
  const takesValue = new Set(VALUE_FLAGS[command] ?? []);
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === "--") break;
    if (!a.startsWith("-")) continue;
    if (!allowed.has(a)) return a;
    if (takesValue.has(a)) i++;
  }
  return void 0;
}
var COMMAND_HELP = {
  submit: `cycle submit \u2014 hand the work in

  cycle submit

  Asks the gate to move this branch's task In Progress -> In Review. If the gate
  says yes it then removes the local grant, so protected zones close again in the
  same breath the board revokes them; rewrites the CC block in AGENTS.md to say no
  task is active; and commits that change.

  It takes no flags and no task id \u2014 the branch names the task (D-11).
  It does not close anything: In Review -> Done is \`cycle verify --close\`.`,
  pause: `cycle pause \u2014 stop without giving up

  cycle pause [task] --reason "..."

  Asks the gate to move a task In Progress -> Todo and hands the grant back:
  protected zones close again here, and are re-earned at the gate when the work
  starts again. The branch keeps the work; nothing is discarded.

  --reason is required. A pause that does not say "until what" is
  indistinguishable from work that quietly stopped.

  The optional task id acts on a task you are NOT standing on \u2014 \`cycle pause
  CC-123\` pauses CC-123 from any checkout, which revokes that task's grant at
  the board while somebody else may be working it. Given no id, it pauses the
  task this branch is bound to, which is what you almost always mean.`,
  start: `cycle start \u2014 intake, scope, branch, gate, grant and record, in one command

  cycle start "what this task does" --goal ... --non-goals ... --criteria ...
  cycle start CC-55 [--goal ...]      adopts a task the board already holds

  Files the task, scopes it, creates the branch, asks the gate to move it to In
  Progress, writes the grant this machine reads, and writes .zones/tasks/<id>.md.
  Nothing else in this repository creates branches, so the branch it checks out is
  the branch the grant binds.

  It refuses to run with uncommitted changes, and the branch is cut from HEAD \u2014
  detach onto the trunk first, or the task inherits another task's commits.
  A refusal at the gate leaves the task in Todo and this shell on the new branch.

  --zone id:write  ask for a protected zone     --topics a,b     load the playbooks
  --priority high  how it is ranked             --gate none      the quality gate`,
  scope: `cycle scope \u2014 correct what a task says without moving it

  cycle scope CC-12 [--title "..."] [--goal "..."] [--non-goals "..."] [--gate g]
                    [--criteria "..."]... [--zone id:mode]... [--topics a,b]
                    [--priority p] [--mode m]

  Rewrites the named fields of that task's record at the board \u2014 and only the
  named ones: an absent flag leaves its field alone. The task id is required,
  and it can name any task, not just the one this branch is bound to.

  It cannot move a task. --state is refused before the call is made, with the
  same rule the board enforces (E15): the gate is the only way between states \u2014
  \`cycle start\`, \`cycle submit\` and \`cycle pause\` are the edges.`,
  verify: `cycle verify \u2014 the closing checks, and the close itself

  cycle verify [--base <ref>] [--from-history] [task]
  cycle verify --close [--evidence <url|path>]... [--override "reason"] [task]

  Without --close it changes NOTHING, locally or at the board: it runs the same
  checks the close runs, in the same words, so a refusal costs no round trip.
  Rehearse with it before every close.

  With --close it asks the gate to move the task In Review -> Done, submits the
  manifest, mirrors this task's events to the board, and writes the audit record
  under .zones/audit \u2014 commit that record with the work.

  --from-history  check the task's own commits in main, for work that merged
                  before it closed, instead of this branch
  --evidence      a URL, or a path that must already be committed here
  --override      recorded by the board with the transition. It cannot answer a
                  local refusal: the local checks run before the board is asked.`,
  login: `cycle login \u2014 sign in to the board

  cycle login [--email you@example.com]

  An address, a six-digit code, done. Writes a session to ~/.commitcycle; nothing
  is written into the repository. More than one address is fine \u2014 each repository
  uses the identity its organization knows.`,
  logout: `cycle logout \u2014 forget an identity on this machine

  cycle logout [email]

  Removes one session for this board, or all of them, from ~/.commitcycle. It
  changes nothing at the board and nothing in the repository. Pairings are
  separate and are left alone \u2014 \`cycle pair\` is what undoes those.`,
  accounts: `cycle accounts \u2014 who this machine is

  cycle accounts

  Read-only. Lists every identity signed in on this machine, the board each one
  belongs to, its organizations, and which one this repository would use. The
  question it answers is not "am I logged in" but "which of me is about to act".`,
  pair: `cycle pair \u2014 join this machine to a board

  cycle pair [--board <url>]

  A code here, confirmed in your browser. Writes .zones/board.json into this
  repository, naming the board, the organization and the repo; the key itself
  goes to ~/.commitcycle and stays out of the repository.`,
  connect: `cycle connect \u2014 the same pairing, started from the board

  cycle connect <ticket> [--board <url>]

  Paste the line the console gave you. Writes .zones/board.json into this
  repository; the key goes to ~/.commitcycle and stays out of the repository.`,
  init: `cycle init \u2014 set this repository up

  cycle init [--yes]

  Proposes zones from what is actually in this repository, installs the hook, and
  writes .zones/zones.yml, the hook settings and the CC block in AGENTS.md. It
  asks before protecting anything; --yes accepts every proposal without asking,
  and is required when there is no terminal to ask in.

  It does not invent an organization, and it never moves a task.`,
  status: `cycle status \u2014 what is active here

  cycle status

  Read-only, no board call. What task this branch is bound to, what the grant
  currently opens, and which board this repository reports to.`,
  show: `cycle show \u2014 read a task as the board holds it

  cycle show [task]

  Read-only. One task, or the board's list. Triage tasks have no record file on
  disk, which is the case this exists for.`,
  sync: `cycle sync \u2014 push the map and events up, pull the grant down

  cycle sync [--no-reconcile]

  Sends this repository's zone map and this task's local events to the board, and
  writes down whatever grant the board holds for this branch \u2014 including a
  revocation, which is the one outcome that changes what you may touch. It never
  moves a task between states.

  It also repairs the drift a vault accumulates when nobody runs maintenance: a
  record behind the board catches up, a task the board holds past Triage with no
  record file gets one written from the board, and a grant file for work the
  board is not running is deleted \u2014 the hook reads those files and never the
  board (D-10), so a leftover one is access nothing upstream believes in. One
  line per repair, silence when there is nothing to repair.

  What it will not do on its own: pause a task (a state change needs your
  reason), rewrite a record that is AHEAD of the board (that is evidence \u2014 run
  \`cycle pull\`), or touch anything at all when two records collide on one id.
  --no-reconcile skips the whole of it.`,
  pull: `cycle pull \u2014 reconcile the record files against the board

  cycle pull [--adopt] [--write-missing]

  With no flags it writes nothing and reports the disagreements. --adopt catches
  stale record files up to the board's task states; --write-missing materialises
  a record for a task the board holds and disk does not. A record AHEAD of the
  board is left alone in both cases \u2014 that is evidence, not staleness (D-49).
  Commit whatever it writes with the task that ran it.`,
  "request-access": `cycle request-access \u2014 ask for a zone that is closed

  cycle request-access [task] --zone <id> --mode read|write --reason "..." --alternative "..."

  Files the ask at the board for the zone's owner to answer. It grants nothing by
  itself and changes no files here. --alternative is not politeness: it is what
  turns a demand into a decision, and about half the time writing it down shows
  the access was not needed. Use --mode read if reading is enough.

  Then carry on with the rest of the task. Working around the block is worse than
  the block, and it is the exact failure this product exists to catch (D-14, D-21).`,
  requests: `cycle requests \u2014 what is waiting on you

  cycle requests

  Read-only. Every access request you can answer: the zone, the task, the reason,
  and what they said they would do instead.`,
  approve: `cycle approve \u2014 answer a request with yes

  cycle approve <id> [--hours N]

  Opens the zone for that task at the board, optionally for N hours. Refused here
  if the zone is not yours: an approval attributed to somebody who did not give it
  is worth less than no approval. The trail records that a session answered it,
  which it distinguishes from a click in the console.`,
  deny: `cycle deny \u2014 answer a request with no

  cycle deny <id>

  Records the refusal at the board and closes the request. Nothing here changes.
  The requester sees it on their next \`cycle sync\`.`,
  ack: `cycle ack \u2014 answer a mention addressed to this task

  cycle ack            list the mentions still open for this branch's task
  cycle ack <when>     discharge the one raised at that timestamp

  A mention is a fact another task left for this one. It carries no command and
  changes no gate decision (D-31) \u2014 an unacknowledged one is a warning at the
  closing gate and never a refusal, and acking it closes that warning and
  nothing else. No zone opens.

  The task is the branch's own and cannot be passed as an argument: the board
  only accepts an ack from the task the mention was addressed to. The mention
  itself stays on the record \u2014 an ack is a second event, never an erasure.`,
  protect: `cycle protect \u2014 answer "should this be protected?" with yes

  cycle protect <glob> --zone <id>

  Adds the path to that zone in .zones/zones.yml \u2014 a local file edit, in your
  diff, committed with your work. It talks to no board and grants nothing.`,
  dismiss: `cycle dismiss \u2014 answer it with no

  cycle dismiss <glob>

  Records the path as reviewed-and-left-open so the closing gate stops asking
  about it. A local file edit, in your diff. It protects nothing and grants
  nothing.`,
  feed: `cycle feed \u2014 append what a close taught to a playbook

  cycle feed <topic> "one bullet (CC-xxx)"

  Appends one bullet to .zones/playbooks/<topic>.md, at the end of its
  "## Feed rule" section \u2014 where the playbook itself says fed knowledge lives,
  never under whatever subheading happens to end the must-know body (CC-581).
  A playbook without that section takes the bullet at the end of the file, and
  the command says so with a note \u2014 a stated fallback, not a silent one.

  A local file edit, in your diff, committed with the close. Always optional:
  skipping is legal by rule, and a required feed would be a mandatory checklist
  arriving from a fourth side (D-45). The sync lint judges the citation, not
  this command.`,
  seed: `cycle seed \u2014 draft playbooks from this codebase

  cycle seed [--topics a,b] [--yes]

  Offers a draft playbook per topic and writes the ones you accept into
  .zones/playbooks. Claims cite real files or are dropped, and a topic with
  nothing to cite is not born. --yes accepts every draft without asking.`,
  challenge: `cycle challenge \u2014 the seed's counterweight (D-46)

  cycle challenge

  Proposals for what this repository lacks, each with a market source. Accepting
  or rejecting one writes a decision file into the repository \u2014 both answers do,
  because a refusal that leaves no record is indistinguishable from never having
  looked. There is no --yes: deciding is yours.`,
  doctor: `cycle doctor \u2014 why is CC behaving like this?

  cycle doctor

  Read-only diagnosis: the zone map, the hook installation, the branch and its
  task, whether the board answers, and whether the record files on disk still
  agree with the board. It changes nothing. Exit 1 if any check failed.`,
  "guard-deploy": `cycle guard-deploy \u2014 refuse a deploy that is not from the trunk

  cycle guard-deploy && <your deploy command>

  Answers from the environment alone: no board, no repository state, no network,
  because it runs inside somebody else's CI where nothing else of ours exists.
  Never remove it from a deploy command, and never set CC_ALLOW_BRANCH_DEPLOY=1
  to make a build pass \u2014 a deploy that needs it gone is the deploy it was
  written for.`,
  "merge-driver": `cycle merge-driver \u2014 the cc-agents git merge driver, as a verb

  git config merge.cc-agents.driver "cycle merge-driver %O %A %B"

  Plumbing: git invokes it during a merge of AGENTS.md, you do not. It 3-way
  merges the human content outside the cc:begin/cc:end block and keeps this
  side's block, so the ephemeral region never conflicts while real edits still
  do (CC-543). It exists as a verb so a repository that does not vendor
  scripts/merge-agents.mjs \u2014 any consumer repo \u2014 still has the driver in the
  binary it installed; \`cycle init\` writes the mapping and \`cycle sync\`
  re-registers the config whenever a clone is missing it (CC-590).`,
  mcp: `cycle mcp \u2014 serve the MCP tools over stdio

  cycle mcp

  For a client's .mcp.json, not for a terminal: stdout is a newline-delimited
  JSON-RPC stream and it never returns. The tools it serves file and scope work
  against the board; the gate is still the only thing that moves a task.`,
  handoff: `cycle handoff \u2014 a day-1 briefing for whoever picks this repository up next

  cycle handoff [--closed N] [--out <path>] [--offline]

  Prints what is running, what is undecided, what was just closed, and the
  order to read it in \u2014 every line read from this repository or from the board
  it answers to. Every section is always present: a source that is missing says
  so, and the last section lists what the briefing could not answer. When the
  board cannot answer (or with --offline) live states come from the record
  files, and the briefing says the states are the files' \u2014 never the board's.

  Without --out it changes nothing, and the last line offers the command that
  would keep it. With --out it writes the briefing there \u2014 never into .zones/ \u2014
  and records its own write in this task's event log, so the close does not
  read the file as an unwitnessed mutation.

  --closed N   how many recently closed tasks to show (default 10)
  --out <path> write the briefing to that file instead of only printing it
  --offline    do not ask the board; the briefing says what that cost`
};

// src/index.ts
function branchTouched(root) {
  for (const base of ["origin/main", "main"]) {
    try {
      const mb = execFileSync13("git", ["merge-base", base, "HEAD"], { cwd: root, stdio: "pipe" }).toString().trim();
      const out = execFileSync13("git", ["diff", "--name-only", `${mb}..HEAD`], { cwd: root, stdio: "pipe" }).toString();
      return new Set(out.split("\n").filter(Boolean));
    } catch {
    }
  }
  return void 0;
}
function repoRoot(from = process.cwd()) {
  try {
    const out = execFileSync13("git", ["rev-parse", "--show-toplevel"], {
      cwd: from,
      stdio: ["ignore", "pipe", "ignore"]
    }).toString().trim();
    if (out) return out;
  } catch {
  }
  let cur = resolve6(from);
  for (; ; ) {
    if (existsSync25(join32(cur, ".git"))) return cur;
    const parent = dirname16(cur);
    if (parent === cur) return null;
    cur = parent;
  }
}
var HELP = `cycle \u2014 a gate for AI-assisted development

  cycle login        Sign in to the board: an address, a six-digit code, done. More than
                  one address is fine \u2014 each repository uses the one its organization knows
  cycle accounts     Who this machine is signed in as, and which identity this repo uses
  cycle logout [email]
                  Forget one identity for this board, or all of them
  cycle pair         Join this machine to a board: a code here, confirmed in your
                  browser. Sets up .zones/board.json \u2014 no name to type
  cycle connect <ticket>
                  The same, started from the board: paste the line it gave you
  cycle guard-deploy Refuse a deploy that is not from the trunk. Put it in front
                  of your deploy command: cycle guard-deploy && <your deploy>
  cycle init         Set this repository up: propose zones, install the hook
  cycle start "title" | <task>   --goal ... --non-goals ... --criteria ... [--zone id:write]
                  [--topics a,b] [--priority high] [--gate none]
                  One command: intake -> scope -> branch -> gate -> grant -> record
  cycle mcp          Serve the MCP tools over stdio, for a client's .mcp.json
  cycle show [task]  Read a task as the board holds it, or list the board.
                  Read-only \u2014 Triage tasks have no record file to read instead
  cycle scope <task> [--title ...] [--goal ...] [--non-goals ...] [--criteria ...]
                  [--zone id:write] [--topics a,b] [--priority high] [--gate none]
                  Correct what a task says. It cannot move it \u2014 that is the gate
  cycle status       What task is active, and what is open to it
  cycle handoff [--closed N] [--out <path>]
                  A day-1 briefing for whoever picks this repository up next:
                  what is running, what is undecided, what was just closed, and
                  the order to read it in. Prints; --out writes
  cycle sync         Push the zone map and events, pull the grant for this branch
  cycle pull [--adopt] [--write-missing]
                  Reconcile the record files against the board's task states
  cycle submit       Hand the work in: In Progress -> In Review, and close the zones
  cycle pause [task] --reason "..."
                  Stop without giving up: In Progress -> Todo, and hand the grant back
  cycle request-access [task] --zone <id> --mode read|write --reason "..." --alternative "..."
                  Ask the zone's owner to open it for this task
  cycle requests     What is waiting on you \u2014 the zone, the task, why, and what
                  they would do instead
  cycle approve <id> [--hours N] \xB7 cycle deny <id>
                  Answer one from here. The console is the stronger door; the
                  trail records which one answered
  cycle ack [when]   Mentions addressed to this branch's task, and the way to
                  discharge one. Advisory \u2014 it closes a warning, opens nothing
  cycle verify [--from-history]
                  Run the closing checks against this branch \u2014 or, for work that
                  merged before it closed, against the task's own commits in main
  cycle protect <glob> --zone <id>
                  Answer "should this be protected?" with yes \u2014 add the path to a zone
  cycle dismiss <glob>
                  Answer it with no \u2014 reviewed, left open, stop asking
  cycle verify --close [--evidence <url|path>]... [--override "reason"]
                  Close it: submit the manifest and write the audit record
  cycle feed <topic> "one bullet (CC-xxx)"
                  Append what a close taught to the topic's playbook \u2014 always optional
  cycle seed [--topics a,b] [--yes]
                  Draft playbooks from the codebase, as choices \u2014 claims cite real
                  files or are dropped; topics with nothing to cite are not born
  cycle challenge    The seed's counterweight (D-46): proposals for what this repo
                  lacks, each with a market source. Accept or reject \u2014 both become
                  decision files; there is no --yes, deciding is yours
  cycle doctor [--enforcement]
                  Why is CC behaving like this? --enforcement answers one
                  question only \u2014 how old is the bundle actually enforcing
                  this session, measured against the source it claims to be
                  built from \u2014 and exits non-zero when the answer is "older"

  --help          This
  cycle <command> --help
                  What that one command changes, before it changes it

Not built yet: discard and promote (Phase 2).
They will tell you so rather than fail oddly.`;
function boardEnv(root) {
  const resolved2 = resolveBoard(root);
  const apiUrl = resolved2.apiUrl;
  if (!apiUrl) {
    console.error(
      'No board address. Set CC_API_URL, or commit .zones/board.json with\n{"api_url": ..., "tenant": ...} so nobody has to export anything.\nUntil a board is reachable a grant cannot be issued \u2014 the CLI cannot mint one.'
    );
    return null;
  }
  const tenant = resolved2.tenant;
  if (!tenant) {
    console.error(
      'Set CC_TENANT \u2014 or add "tenant" to .zones/board.json \u2014 for the organization\nthis repository belongs to.\nThere is no default worth having: a guess writes into a tenant nobody\ncreated, and the board you are looking at never sees any of it.\nIt is the first half of the address in the console \u2014 `pow/commitcycle`\nmeans CC_TENANT=pow.'
    );
    return null;
  }
  if (resolved2.wrongIdentity) {
    const { held } = resolved2.wrongIdentity;
    console.error(
      `
Signed in here as ${held.join(", ")} \u2014 and ${tenant} is not an organization ${held.length > 1 ? "any of them belong" : "that identity belongs"} to.
Every call would come back 404, which reads exactly like "no grant" and is not.

Three ways on, narrowest first:
  cycle pair                     join this machine to ${tenant}/${resolved2.repo} \u2014 scoped to this repository,
                                 and it outranks every session on this laptop
  cycle login                    as an address that is a member of ${tenant}; the others stay,
                                 each repository uses the identity its organization knows
  CC_TOKEN=\u2026 cycle <command>     one command, one credential, nothing stored

If ${tenant} is simply the wrong name, it is "tenant" in .zones/board.json \u2014 the
first half of the address in the console.
`
    );
    return null;
  }
  console.log(`  board  ${apiUrl} \xB7 ${tenant}/${resolved2.repo}`);
  return { apiUrl, token: resolved2.token, tenant, repo: resolved2.repo };
}
var NOT_YET = {
  discard: "Phase 2.",
  promote: "Phase 2."
};
var boardTaskFailed = (status) => status === "unavailable" || status === "not_configured" || status === "invalid";
async function main2() {
  const [command, ...args] = process.argv.slice(2);
  if (!command || command === "--help" || command === "-h" || command === "help") {
    console.log(HELP);
    return 0;
  }
  if (wantsHelp(command, args) && command in COMMAND_HELP) {
    console.log(COMMAND_HELP[command]);
    return 0;
  }
  const stray = unknownFlag(command, args);
  if (stray) {
    console.error(
      `
cycle ${command}: ${stray} is not a flag this command takes, and it will not be ignored.
  it accepts  ${KNOWN_FLAGS[command].filter((f) => f !== "-h").join(" ")}

Nothing was done. \`cycle ${command} --help\` says what this command changes.
`
    );
    return 1;
  }
  if (command in NOT_YET) {
    console.error(`\`cycle ${command}\` is not built yet \u2014 ${NOT_YET[command]}`);
    return 1;
  }
  const root = repoRoot();
  if (!root) {
    console.error("Not inside a git repository. CC binds tasks to branches, so it needs one.");
    return 1;
  }
  switch (command) {
    /* The door (CC-147). Deliberately before `boardEnv`: signing in is the one
       command that must work when nothing else does, and it needs only an
       address for the board — not a tenant, not a repo, not a token. */
    case "login": {
      const resolved2 = resolveBoard(root);
      const apiUrl = resolved2.apiUrl;
      if (!apiUrl) {
        console.error(
          '\nNo board address. Set CC_API_URL, or commit .zones/board.json with\n{"api_url": "https://dash.commitcycle.com"} so nobody has to type it.\n'
        );
        return 1;
      }
      const at2 = args.indexOf("--email");
      const result = await runLogin({
        apiUrl,
        email: at2 === -1 ? void 0 : args[at2 + 1],
        log: (l) => console.log(l)
      });
      if (!result.ok) {
        console.error("\nNot signed in.\n");
        for (const f of result.failures) console.error(`  ${f.field} \u2014 ${f.message}`);
        console.error("");
        return 1;
      }
      console.log(`
The session is in ${sessionPath()}, beside any other address this machine holds.
`);
      return 0;
    }
    /* Who this machine is, in one screen (CC-259). The question it answers is
       not "am I logged in" but "which of me is about to be used here", which is
       the one nobody could ask before. */
    case "accounts": {
      const resolved2 = resolveBoard(root);
      const held = allSessions();
      if (!held.length) {
        console.log("\nNo identity on this machine. `cycle login`, or `cycle pair` to join one repository.\n");
        return 0;
      }
      const chosen = resolved2.apiUrl ? sessionFor(resolved2.apiUrl, resolved2.tenant) : {};
      const active = "session" in chosen ? chosen.session.email : void 0;
      console.log("");
      for (const s of held) {
        const orgs = s.organizations?.length ? s.organizations.join(", ") : s.organizations ? "no organizations" : "organizations unknown \u2014 signed in before they were recorded, so it is tried rather than ruled out";
        const here = s.email === active && s.api_url.replace(/\/+$/, "") === (resolved2.apiUrl ?? "").replace(/\/+$/, "");
        console.log(`  ${here ? "\u2192" : " "} ${s.email}  ${s.api_url}  (${orgs})`);
      }
      if (resolved2.tenant) {
        console.log(
          `
This repository reports to ${resolved2.tenant}/${resolved2.repo}. ` + (active ? `It uses ${active}.` : resolved2.wrongIdentity ? "No identity here belongs to it \u2014 `cycle pair`, or sign in as one that does." : "A pairing or CC_TOKEN answers for it, not a session.")
        );
      }
      console.log(`
Stored in ${sessionPath()}.
`);
      return 0;
    }
    case "logout": {
      const resolved2 = resolveBoard(root);
      if (!resolved2.apiUrl) {
        console.error("\nNo board address, so there is nothing to sign out of. Set CC_API_URL or commit .zones/board.json.\n");
        return 1;
      }
      const who = args.find((a) => a.includes("@"));
      const gone = forgetSessions(resolved2.apiUrl, who);
      if (!gone) {
        console.log(`
Nothing to forget: no session for ${who ?? resolved2.apiUrl} on this machine.
`);
        return 0;
      }
      console.log(
        `
Forgot ${gone} identit${gone === 1 ? "y" : "ies"} for ${resolved2.apiUrl}.
Pairings are separate and were left alone \u2014 \`cycle pair\` is what undoes those.
`
      );
      return 0;
    }
    /* The deploy guard (CC-160). No board, no repository state, no network —
       it answers from the environment alone, because it runs inside somebody
       else's CI where nothing else of ours exists. */
    case "guard-deploy":
      return runGuard();
    case "init": {
      const acceptAll = args.includes("--yes") || args.includes("-y");
      if (!acceptAll && !process.stdin.isTTY) {
        console.error(
          "cycle init asks about this repository, and there is no terminal to ask in.\nRun it in one, or pass --yes to accept every proposal without being asked.\nNothing was written."
        );
        return 1;
      }
      const rl = acceptAll ? null : createInterface3({ input: process.stdin, output: process.stdout });
      const closed = new AbortController();
      rl?.once("close", () => closed.abort());
      console.log(`
Looking at ${root}
`);
      const result = await runInit({
        root,
        acceptAll,
        log: (l) => console.log(l),
        hookPath: existsSync25(join32(root, "packages/hook/bin/cc-hook.sh")) ? "$CLAUDE_PROJECT_DIR/packages/hook/bin/cc-hook.sh" : void 0,
        /* An abandoned question is a no, not a crash (CC-181).
         *
         * `rl.question` rejects when stdin ends — a pipe running dry, a closed
         * terminal, ctrl-D — and every file init writes happens after the
         * question loop. So a setup interrupted anywhere wrote NOTHING: no zone
         * map, no hook, no AGENTS.md. Measured against a fresh repository with
         * two answers and three questions, which is the ordinary shape of
         * somebody changing their mind halfway.
         *
         * Declining is the safe reading of silence: a zone nobody said yes to
         * is not written, and the setup still lands what needs no permission —
         * the system zone, the hook, and the agent context. */
        ask: rl ? async (q) => {
          try {
            const a = await rl.question(`${q} [Y/n] `, { signal: closed.signal });
            return !/^n/i.test(a.trim());
          } catch {
            return false;
          }
        } : void 0,
        // Typed answers, and only with a terminal: `--yes` accepts proposals,
        // it does not invent an organization (CC-87's rule, CC-172's flow).
        askText: rl ? async (q, fallback) => {
          try {
            const a = await rl.question(fallback ? `${q} [${fallback}] ` : `${q} `, { signal: closed.signal });
            return a.trim() || fallback || "";
          } catch {
            return "";
          }
        } : void 0
      });
      rl?.close();
      console.log(`
Protecting ${result.accepted.length} zone(s):`);
      for (const z of result.accepted) console.log(`  ${z.id.padEnd(16)} ${z.paths.join(", ")}`);
      if (result.declined.length) {
        console.log(`
Left unprotected (you said no): ${result.declined.map((z) => z.id).join(", ")}`);
      }
      for (const w of result.warnings) console.log(`  note: ${w}`);
      console.log(`
Wrote:`);
      for (const f of result.wrote) console.log(`  ${f}`);
      console.log(
        `
Next: set a real owner for each zone in .zones/zones.yml \u2014 that is who gets
asked when someone needs access. Then run \`cycle doctor\` to confirm it is live.
`
      );
      if (!existsSync25(join32(root, ".zones", "playbooks"))) {
        console.log(
          `No playbooks yet. Once the board is connected, \`cycle seed\` drafts them from
this codebase \u2014 offered as choices, claims citing real files, topics with
nothing to cite not born (docs/07). Or write them by hand; the contract holds.
`
        );
      }
      return 0;
    }
    case "start": {
      const board2 = boardEnv(root);
      if (!board2) return 1;
      const positional = [];
      for (let i = 0; i < args.length; i++) {
        const a = args[i];
        if (a.startsWith("--")) {
          i++;
          continue;
        }
        positional.push(a);
      }
      const first = positional[0];
      if (!first) {
        console.error(
          'cycle start needs a title, or the id of a task the board already holds:\n  cycle start "what this task does" --goal ... --non-goals ... --criteria ...\n  cycle start CC-55 [--goal ...]        starts what is already on the board'
        );
        return 1;
      }
      const adopting = /^[A-Z]+-\d+$/.test(first);
      const take = (name) => {
        const i = args.indexOf(`--${name}`);
        return i >= 0 ? args[i + 1] : void 0;
      };
      const takeAll = (name) => args.flatMap((a, i) => a === `--${name}` && args[i + 1] ? [args[i + 1]] : []);
      const zones = takeAll("zone").map((z) => {
        const [id, mode] = z.split(":");
        return { id, mode: mode === "read" ? "read" : "write" };
      });
      const topics = (take("topics") ?? "").split(",").map((t) => t.trim()).filter(Boolean);
      let actor = "solo";
      try {
        const { execFileSync: execFileSync14 } = await import("node:child_process");
        actor = execFileSync14("git", ["config", "user.email"], { cwd: root, stdio: "pipe" }).toString().trim() || actor;
      } catch {
      }
      actor = savedIdentity(board2.apiUrl) ?? actor;
      const result = await runStart({
        ...board2,
        root,
        title: adopting ? void 0 : first,
        taskId: adopting ? first : void 0,
        goal: take("goal"),
        nonGoals: take("non-goals"),
        criteria: takeAll("criteria"),
        zones,
        topics,
        // Undefined means "not said", which only an adopted task can honour —
        // a new one still defaults to none, inside runStart.
        gate: take("gate"),
        priority: take("priority"),
        actor
      });
      if (!result.started) {
        console.log(`
${result.taskId} ${adopting ? "was not started" : "filed and scoped, but the gate refused to start it"}:
`);
        for (const f of result.failures) console.log(`  ${f.field ?? "\u2014"} \u2014 ${f.message}`);
        if (result.branch) {
          console.log(`
The task is in Todo, and this shell is now on \`${result.branch}\` \u2014 the branch its grant binds when it starts.`);
          console.log(result.boardError ? `This is the board or the connection, not your task \u2014 wait a moment and run \`cycle start ${result.taskId}\` again; if it keeps failing, \`cycle doctor\` says why.
` : "Fix what the gate named (approvals go through the board), then re-run the transition.\n");
        } else {
          console.log("");
        }
        return 1;
      }
      console.log(`
${result.taskId} is In Progress on \`${result.branch}\``);
      console.log(result.open.length ? `  open   ${result.open.map((z) => `${z.id}:${z.mode}`).join(", ")}${result.expires ? ` \xB7 until ${result.expires}` : ""}` : "  open   no protected zones \u2014 everything unprotected is yours already");
      console.log(`  record .zones/tasks/${result.taskId}.md`);
      if (result.playbooks.length) {
        console.log("\n  Read before working:");
        for (const p of result.playbooks) console.log(`    ${p}`);
      }
      for (const w of result.topicWarnings) console.log(`  note: ${w}`);
      console.log("");
      return 0;
    }
    /* Reading a task, which had no CLI path until CC-164 — the board holds
       Triage content and the repository does not (D-43). */
    case "show": {
      const board2 = boardEnv(root);
      if (!board2) return 1;
      const taskId = args.find((a) => !a.startsWith("--"));
      const result = await runShow({ ...board2, taskId });
      for (const w of result.warnings) console.log(`  note: ${w}`);
      if (!result.ok) {
        console.error("");
        for (const f of result.failures) console.error(`  ${f.field} \u2014 ${f.message}`);
        console.error("");
        return 1;
      }
      console.log("");
      console.log(result.task ? formatTask(result.task) : formatList(result.tasks ?? []));
      console.log("");
      return 0;
    }
    /* The MCP server, from the binary people already install (CC-173).
     *
     * `apps/mcp` is private, so before this the five tools existed only inside
     * this repository — a second project got the CLI and the hook and no way to
     * file or scope work from a session. It is imported, not copied: esbuild
     * bundles it the same way it bundles `@commitcycle/api`, so there is one
     * implementation and not two that can drift.
     *
     * Two things this case must not do. It must not print — stdout is a
     * newline-delimited JSON-RPC stream and a friendly banner corrupts every
     * message, which is why `boardEnv` (which announces the scope) is not used
     * here. And it must not return: the caller turns a resolved promise into
     * `process.exit`, so the server would be killed the moment it was ready. */
    case "mcp": {
      const { main: serve } = await Promise.resolve().then(() => (init_server(), server_exports));
      serve(() => {
        const board2 = resolveBoard(root);
        if (!board2.apiUrl) {
          return { error: "No board address. Run `cycle init` in this repository, or set CC_API_URL \u2014 the MCP tools all talk to a board." };
        }
        if (!board2.tenant) {
          return { error: "No organization. Name one in .zones/board.json or set CC_TENANT \u2014 there is no default worth having, and a guess writes into a tenant nobody created." };
        }
        return { apiUrl: board2.apiUrl, tenant: board2.tenant, repo: board2.repo, token: board2.token };
      });
      return new Promise(() => {
      });
    }
    /* The escalation, answered here (CC-178). See decide.ts for why this door
       exists and why it is the weaker of the two. */
    case "requests":
    case "approve":
    case "deny": {
      const board2 = boardEnv(root);
      if (!board2) return 1;
      const pending = await pendingRequests(board2);
      for (const w of pending.warnings) console.log(`  note: ${w}`);
      if (!pending.ok) {
        console.error(`
  ${pending.message}
`);
        return 1;
      }
      const zones = zoneOwners(root);
      const zoneOf = (id2) => zones.get(id2);
      if (command === "requests") {
        const list = pending.body.requests ?? [];
        console.log("");
        if (!list.length) {
          console.log("Nothing waiting. Blocks that never become a request are the ones worth worrying about.\n");
          return 0;
        }
        for (const r2 of list) {
          const z = zoneOf(r2.zone_id);
          console.log(`${formatRequest(r2, z?.name, z?.owner)}
`);
        }
        console.log(`Answer one with \`cycle approve ${list[0].id}\` or \`cycle deny ${list[0].id}\`.
`);
        return 0;
      }
      const id = args.find((a) => !a.startsWith("--"));
      if (!id) {
        console.error(`cycle ${command} needs a request id \u2014 \`cycle requests\` lists them.`);
        return 1;
      }
      const req = (pending.body.requests ?? []).find((r2) => r2.id === id);
      if (!req) {
        console.error(`
  ${id} is not waiting on anybody. \`cycle requests\` lists what is.
`);
        return 1;
      }
      const me = savedIdentity(board2.apiUrl);
      const owner = zoneOf(req.zone_id)?.owner;
      if (!me) {
        console.error("\n  Not signed in, so there is nobody to attribute this to. Run `cycle login`.\n");
        return 1;
      }
      if (owner && owner !== me && !owner.startsWith("TODO@")) {
        console.error(`
  ${req.zone_id} is owned by ${owner}, and you are signed in as ${me}.`);
        console.error("  An approval attributed to somebody who did not give it is worth less than no approval.\n");
        return 1;
      }
      const at2 = args.indexOf("--hours");
      const ttl = at2 === -1 ? null : Number(args[at2 + 1]);
      const r = await decideRequest(
        board2,
        id,
        command === "approve" ? "approved" : "denied",
        me,
        Number.isFinite(ttl) ? ttl : null
      );
      for (const w of r.warnings) console.log(`  note: ${w}`);
      if (!r.ok) {
        console.error(`
  ${r.message}
`);
        return 1;
      }
      console.log(`
${id} ${command === "approve" ? "approved" : "denied"} as ${me}.`);
      console.log("Recorded as answered from a session, which the trail distinguishes from a click in the console.");
      console.log("`cycle sync` on the task's branch brings the decision down.\n");
      return 0;
    }
    /* The mention, discharged where it was addressed (CC-512).
     *
     * `POST /tasks/:id/mentions/ack` shipped with CC-445 and had no caller
     * anywhere — no command, no tool, no button — so a mention could be raised
     * and never answered, and the closing gate warned about the same open one
     * at every close of that task. See mentions.ts for why this door and not
     * the MCP, and why it is not folded into `cycle sync`.
     *
     * The addressee is the branch's own task and is never a flag: a mention is
     * addressed to a task, the board only accepts an ack from that task's own
     * row, and an id typed by hand is the `cycle pause CC-123` shape — a
     * command reaching a task the person typing it is not standing on. */
    case "ack": {
      const board2 = boardEnv(root);
      if (!board2) return 1;
      const taskId = taskIdFrom(currentBranch(root));
      if (!taskId) {
        console.error("\n  `cycle ack` answers a mention addressed to THIS branch's task, and this");
        console.error("  branch names none. Check out the task branch the mention was sent to.\n");
        return 1;
      }
      const open = await openMentions(board2, taskId);
      for (const w of open.warnings) console.log(`  note: ${w}`);
      if (!open.ok) {
        console.error(`
  ${open.message}
`);
        return 1;
      }
      const list = open.body.mentions ?? [];
      const at2 = args.find((a) => !a.startsWith("--"));
      if (!at2) {
        console.log("");
        if (!list.length) {
          console.log(`Nothing open for ${taskId}. A mention nobody sent is the quiet case, not a problem.
`);
          return 0;
        }
        for (const m of list) console.log(`${formatMention(m)}
`);
        console.log("A checkout named above is claimed, not verified \u2014 `git worktree list --porcelain` settles it.");
        console.log(`Answer one with \`cycle ack ${list[0].t}\`.
`);
        return 0;
      }
      if (!list.some((m) => m.t === at2)) {
        console.error(`
  ${taskId} has no open mention at ${at2}. \`cycle ack\` lists what is open.
`);
        return 1;
      }
      const r = await ackMention(board2, taskId, at2);
      for (const w of r.warnings) console.log(`  note: ${w}`);
      if (!r.ok) {
        console.error(`
  ${r.message}
`);
        return 1;
      }
      console.log(`
Acknowledged the mention of ${at2} on ${taskId}.`);
      console.log("The mention stays on the record \u2014 an ack is a second event, never an erasure.");
      console.log("It closes the closing-gate warning for this one, and changes nothing else.\n");
      return 0;
    }
    /* Joining this machine to a board (CC-184, D-53). Before `boardEnv`, like
       `cycle login`: pairing is what a repository with no board.json does, and
       requiring one first would be the loop it exists to break. */
    case "pair": {
      const at2 = args.indexOf("--board");
      const apiUrl = (at2 === -1 ? void 0 : args[at2 + 1]) ?? resolveBoard(root).apiUrl ?? "https://dash.commitcycle.com";
      const result = await runPair({ root, apiUrl, log: (l) => console.log(l) });
      if (!result.ok) {
        console.error("");
        for (const f of result.failures) console.error(`  ${f.field} \u2014 ${f.message}`);
        console.error("");
        return 1;
      }
      console.log(`
  Paired to ${result.tenant}/${result.repo}.`);
      console.log("  .zones/board.json names the board; the key is in ~/.commitcycle and stays out of the repo.");
      console.log("  Next: `cycle init` if this repository has no zone map yet.\n");
      return 0;
    }
    /* Correcting a task, which had no CLI path at all until CC-162. Deliberately
       beside `start`: they share the flag vocabulary, and the only difference
       that matters is that this one cannot move anything. */
    case "scope": {
      const board2 = boardEnv(root);
      if (!board2) return 1;
      const positional = [];
      for (let i = 0; i < args.length; i++) {
        const a = args[i];
        if (a.startsWith("--")) {
          i++;
          continue;
        }
        positional.push(a);
      }
      const taskId = positional[0];
      if (!taskId) {
        console.error('cycle scope needs a task: cycle scope CC-12 --goal "..." --non-goals "..."');
        return 1;
      }
      const take = (name) => {
        const i = args.indexOf(`--${name}`);
        return i >= 0 ? args[i + 1] : void 0;
      };
      const takeAll = (name) => args.flatMap((a, i) => a === `--${name}` && args[i + 1] ? [args[i + 1]] : []);
      const patch = {};
      const put = (key, value) => {
        if (value !== void 0) patch[key] = value;
      };
      put("title", take("title"));
      put("goal", take("goal"));
      put("non_goals", take("non-goals"));
      put("quality_gate", take("gate"));
      put("mode", take("mode"));
      put("priority", take("priority"));
      const criteria = takeAll("criteria");
      if (criteria.length) patch.acceptance_criteria = criteria;
      const zones = takeAll("zone");
      if (zones.length) {
        patch.affected_zones = zones.map((z) => {
          const [id, mode] = z.split(":");
          return { id, mode: mode === "read" ? "read" : "write" };
        });
      }
      const topics = take("topics");
      if (topics !== void 0) {
        patch.topics = topics.split(",").map((t) => t.trim()).filter(Boolean);
      }
      put("state", take("state"));
      const result = await runScope({ ...board2, taskId, patch });
      for (const w of result.warnings) console.log(`  note: ${w}`);
      if (!result.ok) {
        console.error(`
${taskId} was not changed:
`);
        for (const f of result.failures) console.error(`  ${f.field} \u2014 ${f.message}`);
        console.error("");
        return 1;
      }
      console.log(`
${taskId} updated: ${Object.keys(patch).join(", ")}.`);
      console.log("Nothing moved \u2014 the gate is still the only way between states.\n");
      return 0;
    }
    /* The dashboard-first direction (CC-189). Before `boardEnv` like `cycle pair`:
       a repository with no board.json is exactly what this is for. */
    case "connect": {
      const ticket = args.find((a) => !a.startsWith("--"));
      if (!ticket) {
        console.error("cycle connect needs the ticket from the board: cycle connect <ticket>");
        return 1;
      }
      const at2 = args.indexOf("--board");
      const apiUrl = (at2 === -1 ? void 0 : args[at2 + 1]) ?? resolveBoard(root).apiUrl ?? "https://dash.commitcycle.com";
      const result = await runConnect({ root, apiUrl, ticket, log: (l) => console.log(l) });
      if (!result.ok) {
        console.error("");
        for (const f of result.failures) console.error(`  ${f.field} \u2014 ${f.message}`);
        console.error("");
        return 1;
      }
      console.log(`
  Connected to ${result.tenant}/${result.repo}.`);
      console.log("  .zones/board.json names the board; the key is in ~/.commitcycle and stays out of the repo.");
      console.log("  Next: `cycle init` if this repository has no zone map yet.\n");
      return 0;
    }
    case "doctor": {
      if (args.includes("--enforcement")) {
        const only = enforcementChecks(root);
        console.log("\n" + formatDoctor(only) + "\n");
        return only.some((c) => c.status === "fail") ? 1 : 0;
      }
      const checks = runDoctor(root);
      const resolved2 = resolveBoard(root);
      if (resolved2.apiUrl) {
        checks.push(await handshakeCheck(resolved2.apiUrl));
        checks.push(await updateCheck(resolved2.apiUrl));
      }
      if (resolved2.apiUrl && resolved2.tenant) {
        checks.push(...await recordDriftCheck(root, { ...resolved2, apiUrl: resolved2.apiUrl }));
      }
      console.log("\n" + formatDoctor(checks) + "\n");
      return checks.some((c) => c.status === "fail") ? 1 : 0;
    }
    case "sync": {
      const board2 = boardEnv(root);
      if (!board2) return 1;
      const result = await runSync({
        ...board2,
        root,
        reconcile: !args.includes("--no-reconcile"),
        log: (l) => console.log(l)
      });
      for (const w of result.warnings) console.log(`  note: ${w}`);
      const closing = result.grant === "written" ? `Grant updated for ${result.taskId}. Run \`cycle status\` to see what is open.` : result.grant === "unchanged" ? `Already up to date.` : result.grant === "revoked" ? `The grant for ${result.taskId} was revoked \u2014 protected zones are closed again.` : `Nothing to pull down.`;
      const rec = result.reconciled;
      const repairs = rec.adopted.length + rec.written.length + rec.grantsRemoved.length;
      const repaired = repairs ? ` Reconciled: ${rec.adopted.length} record(s) caught up, ${rec.written.length} written from the board, ${rec.grantsRemoved.length} stranded grant(s) removed. Commit them with the task that ran this.` : "";
      console.log(`
${closing}${repaired}
`);
      return rec.status === "aborted" ? 1 : 0;
    }
    /* Plumbing, not a verb people type: git invokes this as the cc-agents
       merge driver (`merge.cc-agents.driver = "cycle merge-driver %O %A %B"`).
       It exists so a repository that does not vendor scripts/merge-agents.mjs
       — every consumer repo — still carries the driver inside the binary it
       already installed (CC-590). Same code either way: esbuild inlines the
       script, so the vendored file and this verb cannot drift apart. */
    case "merge-driver": {
      const [basePath, oursPath, theirsPath] = args;
      if (!basePath || !oursPath || !theirsPath) {
        console.error(
          "cycle merge-driver: expected three paths (git passes %O %A %B). This is the cc-agents merge driver; git invokes it \u2014 you do not."
        );
        return 2;
      }
      return runMergeDriver(basePath, oursPath, theirsPath);
    }
    case "pull": {
      const board2 = boardEnv(root);
      if (!board2) return 1;
      const adopt = args.includes("--adopt");
      const writeMissing = args.includes("--write-missing");
      const r = await runPull({ ...board2, root, adopt, writeMissing, log: (l) => console.log(l) });
      if (r.status !== "ok") return 1;
      const drifted = r.behind.length + r.ahead.length + r.rewound.length + r.offLadder.length + r.contested.length;
      if (!drifted && !r.unrecorded.length && !r.orphaned.length) {
        console.log("\nEvery record agrees with the board.\n");
        return 0;
      }
      const contestedLine = r.contested.length ? ` ${r.contested.length} contested \u2014 the file and the board describe different work under ${r.contested.map((x) => x.id).join(", ")}; nothing was written there, and \`cycle doctor\` says how to decide which record is real.` : "";
      if (adopt || writeMissing) {
        const did = [
          adopt ? `${r.adopted.length} record(s) caught up` : null,
          writeMissing ? `${r.written.length} written from the board` : null
        ].filter(Boolean).join(", ");
        console.log(
          `
${did}.` + (r.ahead.length ? ` ${r.ahead.length} left alone \u2014 a file ahead of the board is evidence, not staleness.` : "") + contestedLine + " Commit them with the task that ran this.\n"
        );
      } else {
        console.log(
          "\nNothing was written." + (r.behind.length ? ` \`--adopt\` catches up the ${r.behind.length} stale record(s).` : "") + (r.unrecorded.length ? ` \`--write-missing\` materialises the ${r.unrecorded.length} task(s) the board holds and disk does not.` : "") + contestedLine + " The rest need a decision, not a rewrite.\n"
        );
      }
      return adopt && r.contested.length ? 1 : 0;
    }
    case "pause": {
      const board2 = boardEnv(root);
      if (!board2) return 1;
      const named = positionalTaskId("pause", args);
      const at2 = args.indexOf("--reason");
      const reason = (at2 === -1 ? "" : args[at2 + 1]) ?? "";
      if (!reason.trim()) {
        console.error('cycle pause needs --reason "...". A pause that does not say "until what" is indistinguishable from work that quietly stopped.');
        return 1;
      }
      const r = await runPause({
        ...board2,
        root,
        reason,
        taskId: named,
        actor: process.env.CC_ACTOR ?? process.env.USER ?? "unknown",
        log: (l) => console.log(l)
      });
      for (const w of r.warnings) console.log(`  note: ${w}`);
      if (!r.ok) {
        for (const f of r.failures) console.error(`  ${f.field}: ${f.message}`);
        return 1;
      }
      console.log(`
Paused. The branch keeps the work; the grant is handed back and re-earned at the gate when it starts again.
`);
      return 0;
    }
    case "submit": {
      const board2 = boardEnv(root);
      if (!board2) return 1;
      const result = await runSubmit({
        ...board2,
        root,
        actor: process.env.CC_ACTOR ?? process.env.USER ?? "unknown",
        log: (l) => console.log(l)
      });
      for (const w of result.warnings) console.log(`  note: ${w}`);
      if (!result.ok) {
        console.error(`
Not submitted.
`);
        for (const f of result.failures) console.error(`  ${f.field} \u2014 ${f.message}`);
        console.error("");
        return 1;
      }
      console.log(`
${nextStepAfterSubmit()}
`);
      return 0;
    }
    case "request-access": {
      const board2 = boardEnv(root);
      if (!board2) return 1;
      const flag = (name) => {
        const i = args.indexOf(`--${name}`);
        return i === -1 ? void 0 : args[i + 1];
      };
      const zone = flag("zone");
      const reason = flag("reason");
      const alternative = flag("alternative");
      const mode = flag("mode") === "read" || args.includes("--read") ? "read" : "write";
      const positional = args.find((a) => /^[A-Z]+-\d+$/.test(a));
      if (!zone || !reason || !alternative) {
        console.error(
          '\nAsking needs three things:\n\n  --zone <id>          which zone, and it has to be one this repo declares\n  --reason "..."       why the work genuinely needs it\n  --alternative "..."  what you would do if the answer were no\n\nThe last one is not politeness. It is what turns this from a demand into a\ndecision, and about half the time writing it down shows the access was not\nneeded. Use --mode read if reading is enough \u2014 read never grants write.\n'
        );
        return 1;
      }
      const result = await runRequestAccess({
        ...board2,
        root,
        zone,
        reason,
        alternative,
        mode,
        taskId: positional,
        requestedBy: process.env.CC_ACTOR ?? process.env.USER ?? "unknown",
        log: (l) => console.log(l)
      });
      if (!result.ok) {
        console.error("\nNot asked.\n");
        for (const f of result.failures) console.error(`  ${f.field} \u2014 ${f.message}`);
        console.error("");
        return 1;
      }
      console.log(
        `
Asked. Carry on with the rest of the task \u2014 do not work around the block.
When it is answered, \`cycle sync\` brings the decision down.
`
      );
      return 0;
    }
    case "verify": {
      const baseFlag = args.indexOf("--base");
      const base = baseFlag === -1 ? void 0 : args[baseFlag + 1];
      const actor = process.env.CC_ACTOR ?? process.env.USER ?? "unknown";
      const evidenceValues = args.flatMap((a, n) => a === "--evidence" && args[n + 1] ? [args[n + 1]] : []);
      const evidence = parseEvidence(evidenceValues, actor);
      const bad = evidence.filter((e) => missingCapture(root, e));
      if (bad.length) {
        console.error(`
That capture is not in the repository: ${bad.map((e) => e.value).join(", ")}`);
        console.error("Commit it first \u2014 the repo is the source of truth, not object storage.\n");
        return 1;
      }
      if (args.includes("--close")) {
        const board2 = boardEnv(root);
        if (!board2) return 1;
        const overrideAt = args.indexOf("--override");
        const closed = await runClose({
          ...board2,
          root,
          base,
          actor,
          evidence,
          fromHistory: args.includes("--from-history"),
          taskId: positionalTaskId("verify", args),
          override: overrideAt === -1 ? void 0 : { by: actor, reason: args[overrideAt + 1] ?? "" },
          log: (l) => console.log(l)
        });
        for (const w of closed.warnings) console.log(`  note: ${w.message}`);
        if (!closed.ok) {
          console.error(`
Not closed.
`);
          for (const f of closed.failures) console.error(`  ${f.field} \u2014 ${f.message}`);
          console.error("");
          return 1;
        }
        console.log(
          `
${closed.taskId} is Done.` + (closed.auditPath ? ` The record is at ${closed.auditPath} \u2014 commit it with the work.
` : "\n")
        );
        if (closed.taskId) {
          const offers = feedOffers(root, closed.taskId, branchTouched(root));
          if (offers.length) {
            console.log("  If this close taught something, feed it \u2014 skipping is legal by rule:\n");
            for (const o of offers) console.log(`  ${o}
`);
          }
        }
        return 0;
      }
      const result = runVerify({
        root,
        base,
        evidence,
        fromHistory: args.includes("--from-history"),
        taskId: positionalTaskId("verify", args),
        log: (l) => console.log(l)
      });
      for (const w of result.warnings) console.log(`  note: ${w.message}`);
      if (!result.ok) {
        console.error(`
Not ready to close.
`);
        for (const f of result.failures) console.error(`  ${f.field} \u2014 ${f.message}`);
        console.error("");
        return 1;
      }
      console.log(
        `
The diff is inside what ${result.taskId} declared, and every changed file has an
event behind it. Evidence, if the quality gate asks for one, is checked when you close.
`
      );
      return 0;
    }
    case "seed": {
      const board2 = boardEnv(root);
      if (!board2) return 1;
      const yes = args.includes("--yes") || args.includes("-y");
      const topicsAt = args.indexOf("--topics");
      const topics = topicsAt >= 0 && args[topicsAt + 1] ? args[topicsAt + 1].split(",").map((t) => t.trim()).filter(Boolean) : void 0;
      const rl = yes ? null : createInterface3({ input: process.stdin, output: process.stdout });
      const result = await runSeed({
        ...board2,
        root,
        topics,
        ask: rl ? async (q) => !/^n/i.test((await rl.question(`${q} [Y/n] `)).trim()) : void 0,
        log: (l) => console.log(l)
      });
      rl?.close();
      if (result.status === "seeded") {
        console.log(`
Seeded ${result.written.length} playbook(s): ${result.written.join(", ")}.`);
        console.log("Declare topics at cycle start and the gate loads them. Feed them at close \u2014 the loop is theirs now.\n");
      } else if (result.status === "nothing") {
        console.log("\nNothing seeded \u2014 every draft was skipped, already present, or not born.\n");
      } else {
        console.log("");
      }
      return boardTaskFailed(result.status) ? 1 : 0;
    }
    case "challenge": {
      const board2 = boardEnv(root);
      if (!board2) return 1;
      const interactive = process.stdin.isTTY === true;
      const rl = interactive ? createInterface3({ input: process.stdin, output: process.stdout }) : null;
      const result = await runChallenge({
        ...board2,
        root,
        ask: rl ? async (p) => {
          console.log(`
  ${p.title}`);
          console.log(`    source       ${p.market_source}`);
          console.log(`    consequence  ${p.local_consequence}`);
          console.log(`    first step   ${p.suggestion}`);
          const a = (await rl.question("  [a]ccept / [r]eject / [s]kip? ")).trim().toLowerCase();
          return a.startsWith("a") ? "accept" : a.startsWith("r") ? "reject" : "skip";
        } : void 0,
        grounds: rl ? async () => rl.question("  grounds for the refusal (one line): ") : void 0,
        log: (l) => console.log(l)
      });
      rl?.close();
      if (result.status === "done") {
        console.log(`
${result.accepted.length} accepted, ${result.rejected.length} refused knowingly, ${result.skipped} skipped.`);
        if (result.accepted.length || result.rejected.length) {
          console.log("Playbooks may cite the decision files now \u2014 that is the loop: propose, decide, cite.\n");
        }
      } else {
        console.log("");
      }
      return boardTaskFailed(result.status) ? 1 : 0;
    }
    case "feed": {
      const [topic, ...rest] = args.filter((a) => !a.startsWith("--"));
      const text = rest.join(" ").trim();
      if (!topic || !text) {
        console.error('cycle feed needs a topic and a bullet: cycle feed backend "what the close taught (CC-xxx)"');
        return 1;
      }
      const result = runFeed(root, topic, text, taskIdFrom(currentBranch(root)));
      if (!result.ok) {
        console.log(`  note: ${result.warning}`);
        return 0;
      }
      const note = result.warning ? `  note: ${result.warning}

` : "";
      console.log(`
Fed ${result.path}:
  ${result.bullet}

${note}The sync lint judges the citation; commit the playbook with the close.
`);
      return 0;
    }
    case "protect": {
      const glob = args.find((a) => !a.startsWith("--"));
      const zoneAt = args.indexOf("--zone");
      const zone = zoneAt === -1 ? void 0 : args[zoneAt + 1];
      if (!glob || !zone) {
        console.error("\nUsage: cycle protect <glob> --zone <id>\n\nThe glob goes into that zone's paths, in zones.yml, in your diff.\n");
        return 1;
      }
      const r = runProtect(root, glob, zone);
      console.log(`
${r.message}
`);
      return r.ok ? 0 : 1;
    }
    case "dismiss": {
      const glob = args.find((a) => !a.startsWith("--"));
      if (!glob) {
        console.error("\nUsage: cycle dismiss <glob>\n\nRecords the path as reviewed-and-open so the closing gate stops asking about it.\n");
        return 1;
      }
      const r = runDismiss(root, glob);
      console.log(`
${r.message}
`);
      return r.ok ? 0 : 1;
    }
    case "status": {
      console.log("\n" + runStatus(root) + "\n");
      return 0;
    }
    /* The day-1 briefing (CC-580, CC-571 phase 0). Beside `status` and before
       any boardEnv, on purpose: like status, doctor and feed it must answer
       with no board at all — the board is one of its sources, never its
       precondition, and an unreachable one becomes a line in the briefing's
       own "could not answer" section rather than a refusal. */
    case "handoff": {
      const closedAt = args.indexOf("--closed");
      let closed;
      if (closedAt !== -1) {
        closed = Number(args[closedAt + 1]);
        if (!Number.isInteger(closed) || closed < 0) {
          console.error("\ncycle handoff: --closed takes how many recently closed tasks to show, e.g. `cycle handoff --closed 10`. Nothing was done.\n");
          return 1;
        }
      }
      const outAt = args.indexOf("--out");
      const out = outAt === -1 ? void 0 : args[outAt + 1];
      if (outAt !== -1 && (!out || out.startsWith("--"))) {
        console.error("\ncycle handoff: --out takes the path to write, e.g. `cycle handoff --out HANDOFF.md`. Nothing was written.\n");
        return 1;
      }
      const resolved2 = resolveBoard(root);
      const result = await runHandoff({
        root,
        closed,
        out,
        offline: args.includes("--offline"),
        board: resolved2.apiUrl && resolved2.tenant ? { apiUrl: resolved2.apiUrl, tenant: resolved2.tenant, repo: resolved2.repo, token: resolved2.token } : null
      });
      if (!result.ok) {
        console.error(`
${result.refusal}
`);
        return 1;
      }
      if (result.wrote) {
        console.log(`
Wrote ${result.wrote} \u2014 regenerate it with \`cycle handoff --out ${result.wrote}\` rather than editing it.`);
        console.log(result.ownWriteRecorded ? "  note: recorded as this task's own write (CC-205) \u2014 the close reads the diff, and the file now has an event beside it." : "  note: no task is bound to this branch, so the write has no event beside it \u2014 a close here would read it as unwitnessed.");
        console.log("");
      } else {
        console.log("\n" + result.text + "\n");
      }
      return 0;
    }
    default:
      console.error(`Unknown command "${command}".

${HELP}`);
      return 1;
  }
}
main2().then(
  async (code) => {
    await updateNotice(code);
    process.exit(code);
  },
  (err) => {
    console.error(`cycle failed: ${err.message}`);
    process.exit(1);
  }
);
async function updateNotice(code) {
  try {
    if (!ambientNoticeAllowed({ code, stderrIsTTY: Boolean(process.stderr.isTTY), command: process.argv[2] })) return;
    const root = repoRoot();
    if (!root) return;
    const board2 = resolveBoard(root);
    if (!board2.apiUrl) return;
    await notifyIfBehind({ apiUrl: board2.apiUrl });
  } catch {
  }
}
