import {
  __commonJS
} from "./chunk-76J2PTFD.js";

// node_modules/everscale-inpage-provider/dist/utils.js
var require_utils = __commonJS({
  "node_modules/everscale-inpage-provider/dist/utils.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getUniqueId = exports.mergeTransactions = exports.LT_COLLATOR = exports.Semaphore = exports.DelayedTransactions = exports.MessageExpiredException = exports.AddressLiteral = exports.isAddressObject = exports.Address = void 0;
    var Address = class {
      constructor(address) {
        this.equals = (other) => this._equals(other);
        this._address = address;
      }
      toString() {
        return this._address;
      }
      toJSON() {
        return this._address;
      }
      _equals(other) {
        if (typeof other === "string") {
          return this._address === other;
        } else {
          return this._address === (other === null || other === void 0 ? void 0 : other._address);
        }
      }
    };
    exports.Address = Address;
    function isAddressObject(address) {
      return address != null && (address instanceof Address || Object.getPrototypeOf(address).constructor.name === Address.prototype.constructor.name);
    }
    exports.isAddressObject = isAddressObject;
    var AddressLiteral = class extends Address {
      constructor(address) {
        super(address);
      }
    };
    exports.AddressLiteral = AddressLiteral;
    var MessageExpiredException = class extends Error {
      constructor(address, hash) {
        super("Message expired");
        this.address = address;
        this.hash = hash;
      }
    };
    exports.MessageExpiredException = MessageExpiredException;
    var DelayedTransactions = class {
      constructor() {
        this.transactions = /* @__PURE__ */ new Map();
      }
      async waitTransaction(address, hash) {
        var _a;
        let transaction = (_a = this.transactions.get(hash)) === null || _a === void 0 ? void 0 : _a.promise;
        if (transaction == null) {
          let resolve;
          let reject;
          transaction = new Promise((promiseResolve, promiseReject) => {
            resolve = (tx2) => promiseResolve(tx2);
            reject = () => promiseReject();
          });
          this.transactions.set(hash, {
            promise: transaction,
            resolve,
            reject
          });
        }
        const tx = await transaction;
        if (tx == null) {
          throw new MessageExpiredException(address, hash);
        }
        return tx;
      }
      fillTransaction(hash, transaction) {
        const pendingTransaction = this.transactions.get(hash);
        if (pendingTransaction != null) {
          pendingTransaction.resolve(transaction);
        } else {
          this.transactions.set(hash, {
            promise: Promise.resolve(transaction),
            resolve: () => {
            },
            reject: () => {
            }
          });
        }
      }
    };
    exports.DelayedTransactions = DelayedTransactions;
    var Semaphore = class {
      constructor(count) {
        this.tasks = [];
        this.sched = () => {
          var _a;
          if (this.count > 0 && this.tasks.length > 0) {
            this.count--;
            (_a = this.tasks.shift()) === null || _a === void 0 ? void 0 : _a();
          }
        };
        this.count = count;
      }
      acquire() {
        return new Promise((res, _rej) => {
          this.tasks.push(() => {
            let released = false;
            res(() => {
              if (!released) {
                released = true;
                this.count++;
                this.sched();
              }
            });
          });
          nextTick(this.sched);
        });
      }
      releaseAll() {
        var _a;
        while (this.tasks.length > 0) {
          (_a = this.tasks.shift()) === null || _a === void 0 ? void 0 : _a();
        }
      }
    };
    exports.Semaphore = Semaphore;
    function byObserver(Observer) {
      const node = document.createTextNode("");
      let queue, currentQueue, bit = 0, i = 0;
      new Observer(function() {
        let callback;
        if (!queue) {
          if (!currentQueue)
            return;
          queue = currentQueue;
        } else if (currentQueue) {
          queue = currentQueue.slice(i).concat(queue);
        }
        currentQueue = queue;
        queue = null;
        i = 0;
        if (typeof currentQueue === "function") {
          callback = currentQueue;
          currentQueue = null;
          callback();
          return;
        }
        node.data = bit = ++bit % 2;
        while (i < currentQueue.length) {
          callback = currentQueue[i];
          i++;
          if (i === currentQueue.length)
            currentQueue = null;
          callback();
        }
      }).observe(node, { characterData: true });
      return function(fn) {
        if (queue) {
          if (typeof queue === "function")
            queue = [queue, fn];
          else
            queue.push(fn);
          return;
        }
        queue = fn;
        node.data = bit = ++bit % 2;
      };
    }
    var nextTick = function() {
      if (typeof queueMicrotask === "function") {
        return queueMicrotask;
      }
      if (typeof document === "object" && document) {
        if (typeof MutationObserver === "function")
          return byObserver(MutationObserver);
        if (typeof window.WebKitMutationObserver === "function")
          return byObserver(window.WebKitMutationObserver);
      }
      if (typeof setImmediate === "function") {
        return setImmediate;
      }
      if (typeof setTimeout === "function" || typeof setTimeout === "object") {
        return function(cb) {
          setTimeout(cb, 0);
        };
      }
      throw new Error("No `nextTick` implementation found");
    }();
    exports.LT_COLLATOR = new Intl.Collator(void 0, { numeric: true, sensitivity: "base" });
    function mergeTransactions(knownTransactions, newTransactions, info) {
      if (info.batchType === "old") {
        knownTransactions.push(...newTransactions);
        return knownTransactions;
      }
      if (knownTransactions.length === 0) {
        knownTransactions.push(...newTransactions);
        return knownTransactions;
      }
      let i = 0;
      while (i < knownTransactions.length && exports.LT_COLLATOR.compare(knownTransactions[i].id.lt, info.maxLt) >= 0) {
        ++i;
      }
      knownTransactions.splice(i, 0, ...newTransactions);
      return knownTransactions;
    }
    exports.mergeTransactions = mergeTransactions;
    var MAX = 4294967295;
    var idCounter = Math.floor(Math.random() * MAX);
    function getUniqueId() {
      idCounter = (idCounter + 1) % MAX;
      return idCounter;
    }
    exports.getUniqueId = getUniqueId;
  }
});

// node_modules/everscale-inpage-provider/dist/models.js
var require_models = __commonJS({
  "node_modules/everscale-inpage-provider/dist/models.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.parsePartialTokensObject = exports.parseTokensObject = exports.serializeTokensObject = exports.parseAccountInteraction = exports.parsePermissions = exports.parseMessage = exports.serializeMessage = exports.parseTransaction = exports.serializeTransaction = void 0;
    var utils_1 = require_utils();
    function serializeTransaction(transaction) {
      return {
        id: {
          hash: transaction.id.hash,
          lt: transaction.id.lt
        },
        prevTransactionId: transaction.prevTransactionId != null ? {
          hash: transaction.prevTransactionId.hash,
          lt: transaction.prevTransactionId.lt
        } : void 0,
        createdAt: transaction.createdAt,
        aborted: transaction.aborted,
        exitCode: transaction.exitCode,
        resultCode: transaction.resultCode,
        origStatus: transaction.origStatus,
        endStatus: transaction.endStatus,
        totalFees: transaction.totalFees,
        inMessage: serializeMessage(transaction.inMessage),
        outMessages: transaction.outMessages.map(serializeMessage)
      };
    }
    exports.serializeTransaction = serializeTransaction;
    function parseTransaction(transaction) {
      return {
        ...transaction,
        inMessage: parseMessage(transaction.inMessage),
        outMessages: transaction.outMessages.map(parseMessage)
      };
    }
    exports.parseTransaction = parseTransaction;
    function serializeMessage(message) {
      return {
        hash: message.hash,
        src: message.src ? message.src.toString() : void 0,
        dst: message.dst ? message.dst.toString() : void 0,
        value: message.value,
        bounce: message.bounce,
        bounced: message.bounced,
        body: message.body,
        bodyHash: message.bodyHash
      };
    }
    exports.serializeMessage = serializeMessage;
    function parseMessage(message) {
      return {
        ...message,
        src: message.src ? new utils_1.Address(message.src) : void 0,
        dst: message.dst ? new utils_1.Address(message.dst) : void 0
      };
    }
    exports.parseMessage = parseMessage;
    function parsePermissions(permissions) {
      return {
        ...permissions,
        accountInteraction: permissions.accountInteraction ? parseAccountInteraction(permissions.accountInteraction) : void 0
      };
    }
    exports.parsePermissions = parsePermissions;
    function parseAccountInteraction(accountInteraction) {
      return {
        ...accountInteraction,
        address: new utils_1.Address(accountInteraction.address)
      };
    }
    exports.parseAccountInteraction = parseAccountInteraction;
    function serializeTokensObject(object) {
      return serializeTokenValue(object);
    }
    exports.serializeTokensObject = serializeTokensObject;
    function serializeTokenValue(token) {
      if (typeof token === "object" && (0, utils_1.isAddressObject)(token)) {
        return token.toString();
      }
      if (Array.isArray(token)) {
        const result = [];
        for (const item of token) {
          result.push(serializeTokenValue(item));
        }
        return result;
      } else if (token != null && typeof token === "object") {
        const result = {};
        for (const [key, value] of Object.entries(token)) {
          result[key] = serializeTokenValue(value);
        }
        return result;
      } else {
        return token;
      }
    }
    function parseTokensObject(params, object) {
      const result = {};
      for (const param of params) {
        result[param.name] = parseTokenValue(param, object[param.name]);
      }
      return result;
    }
    exports.parseTokensObject = parseTokensObject;
    function parsePartialTokensObject(params, object) {
      const result = {};
      for (const param of params) {
        if (Object.prototype.hasOwnProperty.call(object, param.name)) {
          result[param.name] = parseTokenValue(param, !object[param.name]);
        }
      }
      return result;
    }
    exports.parsePartialTokensObject = parsePartialTokensObject;
    function parseTokenValue(param, token) {
      if (!param.type.startsWith("map")) {
        const isArray = param.type.endsWith("[]");
        const isOptional = !isArray && param.type.startsWith("optional");
        const rawType = isArray ? param.type.slice(0, -2) : isOptional ? param.type.slice(9, -1) : param.type;
        if (isArray) {
          const rawParam = { name: param.name, type: rawType, components: param.components };
          const result = [];
          for (const item of token) {
            result.push(parseTokenValue(rawParam, item));
          }
          return result;
        } else if (isOptional) {
          if (token == null) {
            return null;
          } else {
            const rawParam = { name: param.name, type: rawType, components: param.components };
            return parseTokenValue(rawParam, token);
          }
        } else if (rawType === "tuple") {
          const result = {};
          if (param.components != null) {
            for (const component of param.components) {
              result[component.name] = parseTokenValue(component, token[component.name]);
            }
          }
          return result;
        } else if (rawType === "address") {
          return new utils_1.Address(token);
        } else {
          return token;
        }
      } else {
        const valueTypeIndex = param.type.indexOf(",");
        const keyType = param.type.slice(4, valueTypeIndex);
        const valueType = param.type.slice(valueTypeIndex + 1, -1);
        const result = [];
        for (const [key, value] of token) {
          result.push([
            parseTokenValue({
              name: "",
              type: keyType
            }, key),
            parseTokenValue({
              name: "",
              type: valueType,
              components: param.components
            }, value)
          ]);
        }
        return result;
      }
    }
  }
});

// node_modules/everscale-inpage-provider/dist/stream.js
var require_stream = __commonJS({
  "node_modules/everscale-inpage-provider/dist/stream.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Subscriber = void 0;
    var utils_1 = require_utils();
    var models_1 = require_models();
    var Subscriber = class {
      constructor(provider) {
        this.provider = provider;
        this.subscriptions = /* @__PURE__ */ new Map();
        this.scanners = /* @__PURE__ */ new Map();
        this.unsubscribe = async () => this._unsubscribe();
      }
      /**
       * Returns a stream of new transactions
       */
      transactions(address) {
        return this._addSubscription("transactionsFound", address, false);
      }
      /**
       * Returns a finite stream of child transactions
       * @param transaction - root transaction
       */
      trace(transaction) {
        const id = (0, utils_1.getUniqueId)();
        return new StreamImpl((onData, onEnd) => {
          const scanner = new TraceTransactionsScanner(this.provider, {
            origin: transaction,
            onData,
            onEnd: (eof) => {
              this.scanners.delete(id);
              onEnd(eof);
            }
          });
          this.scanners.set(id, scanner);
          scanner.start();
          return Promise.resolve();
        }, async () => {
          const scanner = this.scanners.get(id);
          if (scanner != null) {
            this.scanners.delete(id);
            await scanner.stop();
          }
        }, identity, true);
      }
      /**
       * Returns a stream of old transactions
       */
      oldTransactions(address, filter) {
        const id = (0, utils_1.getUniqueId)();
        return new StreamImpl((onData, onEnd) => {
          const scanner = new UnorderedTransactionsScanner(this.provider, {
            address,
            onData,
            onEnd: (eof) => {
              this.scanners.delete(id);
              onEnd(eof);
            },
            ...filter
          });
          this.scanners.set(id, scanner);
          scanner.start();
          return Promise.resolve();
        }, async () => {
          const scanner = this.scanners.get(id);
          if (scanner != null) {
            this.scanners.delete(id);
            await scanner.stop();
          }
        }, identity, true);
      }
      states(address) {
        return this._addSubscription("contractStateChanged", address, false);
      }
      async _unsubscribe() {
        const tasks = [];
        for (const item of this.subscriptions.values()) {
          for (const [event, eventData] of Object.entries(item)) {
            delete item[event];
            if (eventData != null) {
              tasks.push(eventData.subscription.then((item2) => item2.unsubscribe()).catch(() => {
              }));
            }
          }
        }
        this.subscriptions.clear();
        for (const scanner of this.scanners.values()) {
          tasks.push(scanner.stop());
        }
        this.scanners.clear();
        await Promise.all(tasks);
      }
      _addSubscription(event, address, isFinite) {
        const rawAddress = address.toString();
        const stopProducer = (id2) => {
          const subscriptions = this.subscriptions.get(rawAddress);
          if (subscriptions == null) {
            return;
          }
          const eventData = subscriptions[event];
          if (eventData != null) {
            const handler = eventData.handlers.get(id2);
            if (handler != null) {
              eventData.handlers.delete(id2);
              const { queue, onEnd, state } = handler;
              if (!state.finished) {
                state.finished = true;
                queue.clear();
                queue.enqueue(async () => onEnd(state.eof));
              }
            }
            if (eventData.handlers.size === 0) {
              const subscription = eventData.subscription;
              delete subscriptions[event];
              subscription.then((subscription2) => subscription2.unsubscribe()).catch(console.debug);
            }
          }
          if (subscriptions.contractStateChanged == null && subscriptions.transactionsFound == null) {
            this.subscriptions.delete(rawAddress);
          }
        };
        const id = (0, utils_1.getUniqueId)();
        return new StreamImpl((onData, onEnd) => {
          const subscriptions = this.subscriptions.get(rawAddress);
          let eventData = subscriptions === null || subscriptions === void 0 ? void 0 : subscriptions[event];
          const state = { eof: false, finished: false };
          const handler = {
            onData,
            onEnd,
            queue: new PromiseQueue(),
            state
          };
          if (eventData != null) {
            eventData.handlers.set(id, handler);
            return Promise.resolve();
          }
          const handlers = /* @__PURE__ */ new Map();
          handlers.set(id, handler);
          const subscription = this.provider.subscribe(event, { address }).then((subscription2) => {
            subscription2.on("data", (data) => {
              for (const { onData: onData2, queue, state: state2 } of handlers.values()) {
                if (state2.eof || state2.finished) {
                  continue;
                }
                queue.enqueue(async () => {
                  if (!await onData2(data)) {
                    state2.eof = true;
                    stopProducer(id);
                  }
                });
              }
            });
            subscription2.on("unsubscribed", () => {
              for (const id2 of handlers.keys()) {
                stopProducer(id2);
              }
            });
            return subscription2;
          }).catch((e) => {
            console.error(e);
            for (const id2 of handlers.keys()) {
              stopProducer(id2);
            }
            throw e;
          });
          eventData = { subscription, handlers };
          if (subscriptions == null) {
            this.subscriptions.set(rawAddress, { [event]: eventData });
          } else {
            subscriptions[event] = eventData;
          }
          return subscription.then(() => {
          });
        }, () => stopProducer(id), identity, isFinite);
      }
    };
    exports.Subscriber = Subscriber;
    async function identity(item, handler) {
      return handler(item);
    }
    var StreamImpl = class _StreamImpl {
      constructor(makeProducer, stopProducer, extractor, isFinite) {
        this.makeProducer = makeProducer;
        this.stopProducer = stopProducer;
        this.extractor = extractor;
        this.isFinite = isFinite;
        this.fold = this.onlyFinite((init, f, ctx) => {
          let state = init;
          return new Promise((resolve, reject) => {
            const subscribed = this.makeProducer(
              // onData
              (data) => this.extractor(data, async (item) => {
                state = await f(state, item);
                return true;
              }),
              // onEnd
              (eof) => {
                if (eof) {
                  resolve(state);
                } else {
                  reject(new Error("Subscription closed"));
                }
              }
            );
            if (ctx != null) {
              ctx.subscribed = subscribed;
            }
          });
        });
        this.finished = this.onlyFinite((ctx) => {
          return new Promise((resolve, reject) => {
            const subscribed = this.makeProducer(
              // onData
              (data) => this.extractor(data, (_item) => true),
              // onEnd
              (eof) => {
                if (eof) {
                  resolve(void 0);
                } else {
                  reject(new Error("Subscription closed"));
                }
              }
            );
            if (ctx != null) {
              ctx.subscribed = subscribed;
            }
          });
        });
      }
      async delayed(f) {
        const { subscribed, result } = f({
          first: () => {
            const ctx = {};
            const result2 = this.first(ctx);
            return { subscribed: ctx.subscribed, result: result2 };
          },
          on: (handler) => {
            const ctx = {};
            this.on(handler, ctx);
            return { subscribed: ctx.subscribed, result: void 0 };
          },
          fold: this.fold != null ? (init, f2) => {
            const ctx = {};
            const result2 = this.fold(init, f2, ctx);
            return { subscribed: ctx.subscribed, result: result2 };
          } : void 0,
          finished: this.finished != null ? () => {
            const ctx = {};
            const result2 = this.finished(ctx);
            return { subscribed: ctx.subscribed, result: result2 };
          } : void 0
        });
        await subscribed;
        return () => result;
      }
      first(ctx) {
        const state = { found: false };
        return new Promise((resolve, reject) => {
          const subscribed = this.makeProducer(
            // onData
            (data) => this.extractor(data, (item) => {
              Object.assign(state, { found: true, result: item });
              return false;
            }),
            // onEnd
            (eof) => {
              if (eof) {
                if (this.isFinite) {
                  resolve(state.found ? state.result : void 0);
                } else if (state.found) {
                  resolve(state.result);
                } else {
                  reject(new Error("Unexpected end of stream"));
                }
              } else {
                reject(new Error("Subscription closed"));
              }
            }
          );
          if (ctx != null) {
            ctx.subscribed = subscribed;
          }
        });
      }
      on(handler, ctx) {
        const subscribed = this.makeProducer((event) => this.extractor(event, async (item) => {
          await handler(item);
          return true;
        }), (_eof) => {
        });
        if (ctx != null) {
          ctx.subscribed = subscribed;
        }
      }
      merge(other) {
        return new _StreamImpl((onData, onEnd) => {
          const state = {
            stopped: false,
            counter: 0
          };
          const checkEnd = (eof) => {
            if (state.stopped) {
              return;
            }
            if (++state.counter == 2 || !eof) {
              state.stopped = true;
              onEnd(eof);
            }
          };
          return Promise.all([
            this.makeProducer(onData, checkEnd),
            other.makeProducer(onData, checkEnd)
          ]).then(() => {
          });
        }, () => {
          this.stopProducer();
          other.stopProducer();
        }, this.extractor, this.isFinite && other.isFinite);
      }
      enumerate() {
        const state = {
          index: 0
        };
        return new _StreamImpl(this.makeProducer, this.stopProducer, (event, handler) => this.extractor(event, async (item) => {
          return handler({
            index: state.index++,
            item
          });
        }), this.isFinite);
      }
      tap(f) {
        return new _StreamImpl(this.makeProducer, this.stopProducer, (event, handler) => this.extractor(event, async (item) => {
          await f(item);
          return handler(item);
        }), this.isFinite);
      }
      filter(f) {
        return new _StreamImpl(this.makeProducer, this.stopProducer, (event, handler) => this.extractor(event, async (item) => {
          if (await f(item)) {
            return handler(item);
          } else {
            return true;
          }
        }), this.isFinite);
      }
      filterMap(f) {
        return new _StreamImpl(this.makeProducer, this.stopProducer, (event, handler) => this.extractor(event, async (item) => {
          const newItem = await f(item);
          if (newItem !== void 0) {
            return handler(newItem);
          } else {
            return true;
          }
        }), this.isFinite);
      }
      map(f) {
        return new _StreamImpl(this.makeProducer, this.stopProducer, (event, handler) => this.extractor(event, async (item) => {
          const newItem = await f(item);
          return handler(newItem);
        }), this.isFinite);
      }
      flatMap(f) {
        return new _StreamImpl(this.makeProducer, this.stopProducer, (event, handler) => this.extractor(event, async (item) => {
          const items = await f(item);
          for (const newItem of items) {
            if (!await handler(newItem)) {
              return false;
            }
          }
          return true;
        }), this.isFinite);
      }
      skip(n) {
        const state = {
          index: 0
        };
        return new _StreamImpl(this.makeProducer, this.stopProducer, (event, handler) => this.extractor(event, (item) => {
          if (state.index >= n) {
            return handler(item);
          } else {
            ++state.index;
            return true;
          }
        }), this.isFinite);
      }
      skipWhile(f) {
        const state = {
          shouldSkip: true
        };
        return new _StreamImpl(this.makeProducer, this.stopProducer, (event, handler) => this.extractor(event, async (item) => {
          if (!state.shouldSkip || !await f(item)) {
            state.shouldSkip = false;
            return handler(item);
          } else {
            return true;
          }
        }), this.isFinite);
      }
      take(n) {
        const state = {
          index: 0
        };
        return new _StreamImpl(this.makeProducer, this.stopProducer, (event, handler) => this.extractor(event, (item) => {
          if (state.index < n) {
            ++state.index;
            return handler(item);
          } else {
            return false;
          }
        }), true);
      }
      takeWhile(f) {
        return new _StreamImpl(this.makeProducer, this.stopProducer, (event, handler) => this.extractor(event, async (item) => {
          if (await f(item)) {
            return handler(item);
          } else {
            return false;
          }
        }), true);
      }
      takeWhileMap(f) {
        return new _StreamImpl(this.makeProducer, this.stopProducer, (event, handler) => this.extractor(event, async (item) => {
          const newItem = await f(item);
          if (newItem !== void 0) {
            return handler(newItem);
          } else {
            return false;
          }
        }), true);
      }
      onlyFinite(f) {
        if (this.isFinite) {
          return f;
        } else {
          return void 0;
        }
      }
    };
    var UnorderedTransactionsScanner = class {
      constructor(provider, params) {
        this.provider = provider;
        this.params = params;
        this.queue = new PromiseQueue();
        this.isRunning = false;
      }
      start() {
        if (this.isRunning || this.promise != null) {
          return;
        }
        this.isRunning = true;
        this.promise = (async () => {
          const params = this.params;
          const state = {
            complete: false
          };
          while (this.isRunning && !state.complete) {
            try {
              const { transactions, continuation } = await this.provider.getTransactions({
                address: this.params.address,
                continuation: this.continuation
              });
              state.complete = !state.complete && transactions.length == null;
              if (!this.isRunning || state.complete) {
                break;
              }
              const filteredTransactions = transactions.filter((item) => (params.fromLt == null || utils_1.LT_COLLATOR.compare(item.id.lt, params.fromLt) > 0) && (params.fromUtime == null || item.createdAt > params.fromUtime));
              if (filteredTransactions.length == 0) {
                state.complete = true;
                break;
              }
              const info = {
                maxLt: filteredTransactions[0].id.lt,
                minLt: filteredTransactions[filteredTransactions.length - 1].id.lt,
                batchType: "old"
              };
              this.queue.enqueue(async () => {
                const isRunning = await this.params.onData({
                  address: this.params.address,
                  transactions: filteredTransactions,
                  info
                });
                if (!isRunning) {
                  state.complete = true;
                  this.isRunning = false;
                }
              });
              if (continuation != null) {
                this.continuation = continuation;
              } else {
                state.complete = true;
                break;
              }
            } catch (e) {
              console.error(e);
            }
          }
          this.queue.enqueue(async () => this.params.onEnd(state.complete));
          this.isRunning = false;
          this.continuation = void 0;
        })();
      }
      async stop() {
        this.isRunning = false;
        this.queue.clear();
        if (this.promise != null) {
          await this.promise;
        } else {
          this.params.onEnd(false);
        }
      }
    };
    var TraceTransactionsScanner = class {
      constructor(provider, params) {
        this.provider = provider;
        this.params = params;
        this.queue = new PromiseQueue();
        this.isRunning = false;
        this.semaphore = new utils_1.Semaphore(10);
      }
      start() {
        if (this.isRunning || this.promise != null) {
          return;
        }
        const provider = this.provider;
        this.isRunning = true;
        this.promise = (async () => {
          const state = {
            complete: false
          };
          const makePendingTransaction = (messageHash) => {
            const state2 = { stopped: false };
            const promise = (async () => {
              let timeout = 500;
              while (true) {
                const release = await this.semaphore.acquire();
                if (state2.stopped) {
                  release();
                  return;
                }
                const result = await provider.rawApi.findTransaction({
                  inMessageHash: messageHash
                }).catch(() => ({ transaction: void 0 })).finally(() => release());
                if (state2.stopped) {
                  return;
                }
                if (result.transaction != null) {
                  const transaction = (0, models_1.parseTransaction)(result.transaction);
                  transaction.account = transaction.inMessage.dst;
                  return transaction;
                }
                let resolve;
                const promise2 = new Promise((resolvePromise, rejectPromise) => {
                  resolve = () => resolvePromise();
                  state2.reject = () => rejectPromise();
                });
                state2.timeout = setTimeout(resolve, timeout);
                await promise2;
                if (state2.stopped) {
                  return;
                }
                state2.reject = void 0;
                timeout = Math.min(timeout * 2, 3e3);
              }
            })();
            const reject = () => {
              var _a;
              state2.stopped = true;
              (_a = state2.reject) === null || _a === void 0 ? void 0 : _a.call(state2);
              if (state2.timeout != null) {
                clearTimeout(state2.timeout);
              }
            };
            return { promise, reject };
          };
          const transactionsQueue = [this.params.origin];
          try {
            outer:
              while (this.isRunning) {
                const transaction = transactionsQueue.shift();
                if (transaction == null) {
                  state.complete = true;
                  break;
                }
                const pendingTransactions = transaction.outMessages.filter((message) => message.dst != null).map((message) => {
                  const messageHash = message.hash;
                  return makePendingTransaction(messageHash);
                });
                this.pendingTransactions = pendingTransactions;
                for (const { promise } of pendingTransactions) {
                  const childTransaction = await promise;
                  if (!this.isRunning || state.complete || childTransaction == null) {
                    break outer;
                  }
                  this.queue.enqueue(async () => {
                    const isRunning = await this.params.onData(childTransaction);
                    if (!isRunning) {
                      state.complete = true;
                      this.isRunning = false;
                      this.rejectPendingTransactions();
                    }
                  });
                  transactionsQueue.push(childTransaction);
                }
                this.pendingTransactions = void 0;
              }
          } catch (e) {
            console.error(e);
          } finally {
            this.queue.enqueue(async () => this.params.onEnd(state.complete));
            this.isRunning = false;
            this.rejectPendingTransactions();
          }
        })();
      }
      async stop() {
        this.isRunning = false;
        this.queue.clear();
        this.rejectPendingTransactions();
        if (this.promise != null) {
          await this.promise;
        } else {
          this.params.onEnd(false);
        }
      }
      rejectPendingTransactions() {
        if (this.pendingTransactions != null) {
          for (const pendingTransaction of this.pendingTransactions) {
            pendingTransaction.reject();
          }
          this.pendingTransactions = void 0;
        }
        this.semaphore.releaseAll();
      }
    };
    var PromiseQueue = class {
      constructor() {
        this.queue = [];
        this.workingOnPromise = false;
      }
      enqueue(promise) {
        this.queue.push(promise);
        this._dequeue().catch(() => {
        });
      }
      clear() {
        this.queue.length = 0;
      }
      async _dequeue() {
        if (this.workingOnPromise) {
          return;
        }
        const item = this.queue.shift();
        if (!item) {
          return;
        }
        this.workingOnPromise = true;
        item().then(() => {
          this.workingOnPromise = false;
          this._dequeue();
        }).catch(() => {
          this.workingOnPromise = false;
          this._dequeue();
        });
      }
    };
  }
});

// node_modules/everscale-inpage-provider/dist/contract.js
var require_contract = __commonJS({
  "node_modules/everscale-inpage-provider/dist/contract.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TvmException = exports.Contract = void 0;
    var utils_1 = require_utils();
    var models_1 = require_models();
    var Contract = class {
      constructor(provider, abi, address) {
        if (!Array.isArray(abi.functions)) {
          throw new Error("Invalid abi. Functions array required");
        }
        if (!Array.isArray(abi.events)) {
          throw new Error("Invalid abi. Events array required");
        }
        this._provider = provider;
        this._abi = JSON.stringify(abi);
        this.methodsAbi = abi.functions.reduce((functions, item) => {
          if (item.inputs == null) {
            item.inputs = [];
          }
          if (item.outputs == null) {
            item.outputs = [];
          }
          functions[item.name] = item;
          return functions;
        }, {});
        this.eventsAbi = abi.events.reduce((events, item) => {
          if (item.inputs == null) {
            item.inputs = [];
          }
          events[item.name] = item;
          return events;
        }, {});
        this.fieldsAbi = abi.fields;
        this._address = address;
        this._methods = new Proxy({}, {
          get: (_object, method) => {
            const rawAbi = this.methodsAbi[method];
            return (params = {}) => new ContractMethodImpl(this._provider, rawAbi, this._abi, this._address, method, params);
          }
        });
        this._fields = new Proxy({}, {
          get: (_object, field) => {
            return async (params = {}) => {
              await this._provider.ensureInitialized();
              const { fields, state } = await this._provider.rawApi.getContractFields({
                address: this._address.toString(),
                abi: this._abi,
                cachedState: params === null || params === void 0 ? void 0 : params.cachedState,
                allowPartial: (params === null || params === void 0 ? void 0 : params.allowPartial) == null ? false : params.allowPartial
              });
              if (fields == null) {
                if (state == null) {
                  throw new Error("Account does not exist");
                } else if (!state.isDeployed) {
                  throw new Error("Account is not deployed");
                } else {
                  throw new Error("Invalid account data");
                }
              }
              const parsedFields = (0, models_1.parseTokensObject)(this.fieldsAbi, fields);
              if (parsedFields == null || !Object.prototype.hasOwnProperty.call(parsedFields, field)) {
                throw new Error("Unknown field");
              }
              return parsedFields[field];
            };
          }
        });
      }
      get methods() {
        return this._methods;
      }
      get fields() {
        return this._fields;
      }
      get address() {
        return this._address;
      }
      get abi() {
        return this._abi;
      }
      /**
       * Requests contract data
       *
       * ---
       * Required permissions: `basic`
       */
      async getFullState() {
        await this._provider.ensureInitialized();
        return await this._provider.rawApi.getFullContractState({
          address: this.address.toString()
        });
      }
      /**
       * Unpacks all fields from the contract state using the specified ABI
       *
       * ---
       * Required permissions: `basic`
       */
      async getFields(args = {}) {
        await this._provider.ensureInitialized();
        const { fields, state } = await this._provider.rawApi.getContractFields({
          address: this.address.toString(),
          abi: this._abi,
          cachedState: args.cachedState,
          allowPartial: args.allowPartial == null ? false : args.allowPartial
        });
        return {
          fields: fields != null ? (0, models_1.parseTokensObject)(this.fieldsAbi, fields) : void 0,
          state
        };
      }
      /**
       * Creates new contract transactions stream
       *
       * @param subscriber
       */
      transactions(subscriber) {
        return subscriber.transactions(this._address).flatMap(({ transactions }) => transactions);
      }
      /**
       * Creates new contract events stream
       *
       * @param subscriber
       */
      events(subscriber) {
        return subscriber.transactions(this._address).flatMap(({ transactions }) => transactions).flatMap((tx) => this.decodeTransactionEvents({ transaction: tx }).then((events) => {
          events.forEach((event) => event.transaction = tx);
          return events;
        }));
      }
      async waitForEvent(args = {}) {
        const { range, filter } = args;
        const filterFn = typeof filter === "string" ? ({ event: event2 }) => event2 === filter : filter;
        let subscriber = args.subscriber;
        const hasTempSubscriber = subscriber == null;
        if (subscriber == null) {
          subscriber = new this._provider.Subscriber();
        }
        const event = await ((range === null || range === void 0 ? void 0 : range.fromLt) != null || (range === null || range === void 0 ? void 0 : range.fromUtime) != null ? subscriber.oldTransactions(this._address, range).merge(subscriber.transactions(this._address)) : subscriber.transactions(this.address)).flatMap((item) => item.transactions).takeWhile((item) => range == null || (range.fromLt == null || utils_1.LT_COLLATOR.compare(item.id.lt, range.fromLt) > 0) && (range.fromUtime == null || item.createdAt > range.fromUtime) && (range.toLt == null || utils_1.LT_COLLATOR.compare(item.id.lt, range.toLt) < 0) && (range.toUtime == null || item.createdAt < range.toUtime)).flatMap((tx) => this.decodeTransactionEvents({ transaction: tx }).then((events) => {
          events.forEach((event2) => event2.transaction = tx);
          return events;
        })).filterMap(async (event2) => {
          if (filterFn == null || await filterFn(event2)) {
            return event2;
          } else {
            return void 0;
          }
        }).first();
        hasTempSubscriber && await subscriber.unsubscribe();
        return event;
      }
      async getPastEvents(args) {
        const { range, filter, limit } = args;
        const filterFn = typeof filter === "string" ? ({ event }) => event === filter : filter;
        const result = [];
        let currentContinuation = args === null || args === void 0 ? void 0 : args.continuation;
        outer:
          while (true) {
            const { transactions, continuation } = await this._provider.getTransactions({
              address: this._address,
              continuation: currentContinuation
            });
            if (transactions.length === null) {
              break;
            }
            const filteredTransactions = transactions.filter((item) => ((range === null || range === void 0 ? void 0 : range.fromLt) == null || utils_1.LT_COLLATOR.compare(item.id.lt, range.fromLt) > 0) && ((range === null || range === void 0 ? void 0 : range.fromUtime) == null || item.createdAt > range.fromUtime) && ((range === null || range === void 0 ? void 0 : range.toLt) == null || utils_1.LT_COLLATOR.compare(item.id.lt, range.toLt) < 0) && ((range === null || range === void 0 ? void 0 : range.toUtime) == null || item.createdAt < range.toUtime));
            if (filteredTransactions.length > 0) {
              const parsedEvents = await Promise.all(filteredTransactions.map(async (tx) => {
                return {
                  tx,
                  events: await this.decodeTransactionEvents({ transaction: tx }).then((events) => {
                    events.forEach((event) => event.transaction = tx);
                    return events;
                  })
                };
              }));
              for (let { tx, events } of parsedEvents) {
                if (filterFn != null) {
                  events = await Promise.all(events.map(async (event) => await filterFn(event) ? event : void 0)).then((events2) => events2.filter((event) => event != null));
                }
                currentContinuation = tx.id;
                for (const event of events) {
                  if (limit != null && result.length >= limit) {
                    break outer;
                  }
                  result.push(event);
                }
                if (limit != null && result.length >= limit) {
                  break outer;
                }
              }
            }
            currentContinuation = continuation;
            if (currentContinuation == null) {
              break;
            }
          }
        return { events: result, continuation: currentContinuation };
      }
      async decodeTransaction(args) {
        await this._provider.ensureInitialized();
        try {
          const result = await this._provider.rawApi.decodeTransaction({
            transaction: (0, models_1.serializeTransaction)(args.transaction),
            abi: this._abi,
            method: args.methods
          });
          if (result == null) {
            return void 0;
          }
          const { method, input, output } = result;
          const rawAbi = this.methodsAbi[method];
          return {
            method,
            input: rawAbi.inputs != null ? (0, models_1.parseTokensObject)(rawAbi.inputs, input) : {},
            output: rawAbi.outputs != null ? (0, models_1.parseTokensObject)(rawAbi.outputs, output) : {}
          };
        } catch (_) {
          return void 0;
        }
      }
      async decodeTransactionEvents(args) {
        await this._provider.ensureInitialized();
        try {
          const { events } = await this._provider.rawApi.decodeTransactionEvents({
            transaction: (0, models_1.serializeTransaction)(args.transaction),
            abi: this._abi
          });
          const result = [];
          for (const { event, data } of events) {
            const rawAbi = this.eventsAbi[event];
            result.push({
              event,
              data: rawAbi.inputs != null ? (0, models_1.parseTokensObject)(rawAbi.inputs, data) : {}
            });
          }
          return result;
        } catch (_) {
          return [];
        }
      }
      async decodeInputMessage(args) {
        await this._provider.ensureInitialized();
        try {
          const result = await this._provider.rawApi.decodeInput({
            abi: this._abi,
            body: args.body,
            internal: args.internal,
            method: args.methods
          });
          if (result == null) {
            return void 0;
          }
          const { method, input } = result;
          const rawAbi = this.methodsAbi[method];
          return {
            method,
            input: rawAbi.inputs != null ? (0, models_1.parseTokensObject)(rawAbi.inputs, input) : {}
          };
        } catch (_) {
          return void 0;
        }
      }
      async decodeOutputMessage(args) {
        await this._provider.ensureInitialized();
        try {
          const result = await this._provider.rawApi.decodeOutput({
            abi: this._abi,
            body: args.body,
            method: args.methods
          });
          if (result == null) {
            return void 0;
          }
          const { method, output } = result;
          const rawAbi = this.methodsAbi[method];
          return {
            method,
            output: rawAbi.outputs != null ? (0, models_1.parseTokensObject)(rawAbi.outputs, output) : {}
          };
        } catch (_) {
          return void 0;
        }
      }
      async decodeEvent(args) {
        await this._provider.ensureInitialized();
        try {
          const result = await this._provider.rawApi.decodeEvent({
            abi: this.abi,
            body: args.body,
            event: args.events
          });
          if (result == null) {
            return void 0;
          }
          const { event, data } = result;
          const rawAbi = this.eventsAbi[event];
          return {
            event,
            data: rawAbi.inputs != null ? (0, models_1.parseTokensObject)(rawAbi.inputs, data) : {}
          };
        } catch (_) {
          return void 0;
        }
      }
    };
    exports.Contract = Contract;
    var TvmException = class extends Error {
      constructor(code) {
        super(`TvmException: ${code}`);
        this.code = code;
      }
    };
    exports.TvmException = TvmException;
    var ContractMethodImpl = class {
      constructor(provider, functionAbi, abi, address, method, params) {
        this.provider = provider;
        this.functionAbi = functionAbi;
        this.abi = abi;
        this.address = address;
        this.method = method;
        this.params = (0, models_1.serializeTokensObject)(params);
      }
      async send(args) {
        await this.provider.ensureInitialized();
        const { transaction } = await this.provider.rawApi.sendMessage({
          sender: args.from.toString(),
          recipient: this.address.toString(),
          amount: args.amount,
          bounce: args.bounce == null ? true : args.bounce,
          payload: {
            abi: this.abi,
            method: this.method,
            params: this.params
          },
          stateInit: args.stateInit
        });
        return (0, models_1.parseTransaction)(transaction);
      }
      async sendDelayed(args) {
        await this.provider.ensureInitialized();
        const transactions = new utils_1.DelayedTransactions();
        const subscription = await this.provider.subscribe("messageStatusUpdated");
        subscription.on("data", (data) => {
          if (!data.address.equals(args.from)) {
            return;
          }
          transactions.fillTransaction(data.hash, data.transaction);
        });
        const { message } = await this.provider.rawApi.sendMessageDelayed({
          sender: args.from.toString(),
          recipient: this.address.toString(),
          amount: args.amount,
          bounce: args.bounce == null ? true : args.bounce,
          payload: {
            abi: this.abi,
            method: this.method,
            params: this.params
          },
          stateInit: args.stateInit
        }).catch((e) => {
          subscription.unsubscribe().catch(console.error);
          throw e;
        });
        const transaction = transactions.waitTransaction(this.address, message.hash).finally(() => subscription.unsubscribe().catch(console.error));
        return {
          messageHash: message.hash,
          expireAt: message.expireAt,
          transaction
        };
      }
      async sendWithResult(args) {
        await this.provider.ensureInitialized();
        let subscriber = args.subscriber;
        const hasTempSubscriber = subscriber == null;
        if (subscriber == null) {
          subscriber = new this.provider.Subscriber();
        }
        try {
          let parentTransaction = void 0;
          let resolveChildTransactionPromise;
          const childTransactionPromise = new Promise((resolve) => {
            resolveChildTransactionPromise = (tx) => resolve(tx);
          });
          const possibleChildren = [];
          subscriber.transactions(this.address).flatMap((batch) => batch.transactions).filter((item) => {
            var _a;
            return ((_a = item.inMessage.src) === null || _a === void 0 ? void 0 : _a.equals(args.from)) || false;
          }).on((tx) => {
            if (parentTransaction == null) {
              possibleChildren.push(tx);
            } else if (parentTransaction.possibleMessages.findIndex((msg) => msg.hash == tx.inMessage.hash) >= 0) {
              resolveChildTransactionPromise === null || resolveChildTransactionPromise === void 0 ? void 0 : resolveChildTransactionPromise(tx);
            }
          });
          const transaction = await this.send(args);
          const possibleMessages = transaction.outMessages.filter((msg) => {
            var _a;
            return ((_a = msg.dst) === null || _a === void 0 ? void 0 : _a.equals(this.address)) || false;
          });
          parentTransaction = {
            transaction,
            possibleMessages
          };
          const alreadyReceived = possibleChildren.find((tx) => {
            return possibleMessages.findIndex((msg) => msg.hash == tx.inMessage.hash) >= 0;
          });
          if (alreadyReceived != null) {
            resolveChildTransactionPromise === null || resolveChildTransactionPromise === void 0 ? void 0 : resolveChildTransactionPromise(alreadyReceived);
          }
          const childTransaction = await childTransactionPromise;
          let output = void 0;
          try {
            const result = await this.provider.rawApi.decodeTransaction({
              transaction: (0, models_1.serializeTransaction)(childTransaction),
              abi: this.abi,
              method: this.method
            });
            if (result != null) {
              output = this.functionAbi.outputs != null ? (0, models_1.parseTokensObject)(this.functionAbi.outputs, result.output) : {};
            }
          } catch (e) {
            console.error(e);
          }
          return {
            parentTransaction: parentTransaction.transaction,
            childTransaction,
            output
          };
        } finally {
          hasTempSubscriber && await subscriber.unsubscribe();
        }
      }
      async estimateFees(args) {
        await this.provider.ensureInitialized();
        const { fees } = await this.provider.rawApi.estimateFees({
          sender: args.from.toString(),
          recipient: this.address.toString(),
          amount: args.amount,
          payload: {
            abi: this.abi,
            method: this.method,
            params: this.params
          },
          stateInit: args.stateInit
        });
        return fees;
      }
      async sendExternal(args) {
        await this.provider.ensureInitialized();
        const method = args.withoutSignature === true ? this.provider.rawApi.sendUnsignedExternalMessage : this.provider.rawApi.sendExternalMessage;
        const { transaction, output } = await method({
          publicKey: args.publicKey,
          recipient: this.address.toString(),
          stateInit: args.stateInit,
          payload: {
            abi: this.abi,
            method: this.method,
            params: this.params
          },
          local: args.local,
          executorParams: args.executorParams ? {
            disableSignatureCheck: args.executorParams.disableSignatureCheck,
            overrideBalance: args.executorParams.overrideBalance
          } : void 0
        });
        return {
          transaction: (0, models_1.parseTransaction)(transaction),
          output: output != null ? (0, models_1.parseTokensObject)(this.functionAbi.outputs, output) : void 0
        };
      }
      async sendExternalDelayed(args) {
        await this.provider.ensureInitialized();
        const transactions = new utils_1.DelayedTransactions();
        const subscription = await this.provider.subscribe("messageStatusUpdated");
        subscription.on("data", (data) => {
          if (!data.address.equals(this.address)) {
            return;
          }
          transactions.fillTransaction(data.hash, data.transaction);
        });
        const { message } = await this.provider.rawApi.sendExternalMessageDelayed({
          publicKey: args.publicKey,
          recipient: this.address.toString(),
          stateInit: args.stateInit,
          payload: {
            abi: this.abi,
            method: this.method,
            params: this.params
          }
        }).catch((e) => {
          subscription.unsubscribe().catch(console.error);
          throw e;
        });
        const transaction = transactions.waitTransaction(this.address, message.hash).finally(() => subscription.unsubscribe().catch(console.error));
        return {
          messageHash: message.hash,
          expireAt: message.expireAt,
          transaction
        };
      }
      async call(args = {}) {
        await this.provider.ensureInitialized();
        const { output, code } = await this.provider.rawApi.runLocal({
          address: this.address.toString(),
          cachedState: args.cachedState,
          responsible: args.responsible,
          functionCall: {
            abi: this.abi,
            method: this.method,
            params: this.params
          }
        });
        if (output == null || code != 0) {
          throw new TvmException(code);
        } else {
          return (0, models_1.parseTokensObject)(this.functionAbi.outputs, output);
        }
      }
      /**
       * Encodes this method as an external message and
       * executes all transaction phases locally, producing a new state
       */
      async executeExternal(args) {
        await this.provider.ensureInitialized();
        const { transaction, newState, output } = await this.provider.rawApi.executeLocal({
          address: this.address.toString(),
          cachedState: args.cachedState,
          stateInit: args.stateInit,
          payload: {
            abi: this.abi,
            method: this.method,
            params: this.params
          },
          messageHeader: {
            type: "external",
            publicKey: args.publicKey,
            withoutSignature: args.withoutSignature
          },
          executorParams: args.executorParams != null ? {
            disableSignatureCheck: args.executorParams.disableSignatureCheck,
            overrideBalance: args.executorParams.overrideBalance
          } : void 0
        });
        return {
          transaction: (0, models_1.parseTransaction)(transaction),
          newState,
          output: output !== void 0 ? (0, models_1.parseTokensObject)(this.functionAbi.outputs, output) : void 0
        };
      }
      /**
       * Encodes this method as an internal message and
       * executes all transaction phases locally, producing a new state
       */
      async executeInternal(args) {
        await this.provider.ensureInitialized();
        const { transaction, newState, output } = await this.provider.rawApi.executeLocal({
          address: this.address.toString(),
          cachedState: args.cachedState,
          stateInit: args.stateInit,
          payload: {
            abi: this.abi,
            method: this.method,
            params: this.params
          },
          messageHeader: {
            type: "internal",
            sender: args.sender.toString(),
            amount: args.amount,
            bounce: args.bounce != null ? args.bounce : false,
            bounced: args.bounced
          },
          executorParams: args.executorParams != null ? {
            disableSignatureCheck: args.executorParams.disableSignatureCheck,
            overrideBalance: args.executorParams.overrideBalance
          } : void 0
        });
        return {
          transaction: (0, models_1.parseTransaction)(transaction),
          newState,
          output: output !== void 0 ? (0, models_1.parseTokensObject)(this.functionAbi.outputs, output) : void 0
        };
      }
      async encodeInternal() {
        await this.provider.ensureInitialized();
        const { boc } = await this.provider.rawApi.encodeInternalInput({
          abi: this.abi,
          method: this.method,
          params: this.params
        });
        return boc;
      }
    };
  }
});

// node_modules/everscale-inpage-provider/dist/api.js
var require_api = __commonJS({
  "node_modules/everscale-inpage-provider/dist/api.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// node_modules/everscale-inpage-provider/dist/index.js
var require_dist = __commonJS({
  "node_modules/everscale-inpage-provider/dist/index.js"(exports) {
    var __createBinding = exports && exports.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    } : function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      o[k2] = m[k];
    });
    var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    } : function(o, v) {
      o["default"] = v;
    });
    var __importStar = exports && exports.__importStar || function(mod) {
      if (mod && mod.__esModule)
        return mod;
      var result = {};
      if (mod != null) {
        for (var k in mod)
          if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k))
            __createBinding(result, mod, k);
      }
      __setModuleDefault(result, mod);
      return result;
    };
    var __exportStar = exports && exports.__exportStar || function(m, exports2) {
      for (var p in m)
        if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports2, p))
          __createBinding(exports2, m, p);
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ProviderNotInitializedException = exports.ProviderNotFoundException = exports.ProviderRpcClient = exports.hasEverscaleProvider = exports.LT_COLLATOR = exports.isAddressObject = exports.mergeTransactions = exports.MessageExpiredException = exports.AddressLiteral = exports.Address = exports.Subscriber = void 0;
    var models_1 = require_models();
    var utils_1 = require_utils();
    var subscriber = __importStar(require_stream());
    var contract = __importStar(require_contract());
    __exportStar(require_api(), exports);
    __exportStar(require_models(), exports);
    __exportStar(require_contract(), exports);
    var stream_1 = require_stream();
    Object.defineProperty(exports, "Subscriber", { enumerable: true, get: function() {
      return stream_1.Subscriber;
    } });
    var utils_2 = require_utils();
    Object.defineProperty(exports, "Address", { enumerable: true, get: function() {
      return utils_2.Address;
    } });
    Object.defineProperty(exports, "AddressLiteral", { enumerable: true, get: function() {
      return utils_2.AddressLiteral;
    } });
    Object.defineProperty(exports, "MessageExpiredException", { enumerable: true, get: function() {
      return utils_2.MessageExpiredException;
    } });
    Object.defineProperty(exports, "mergeTransactions", { enumerable: true, get: function() {
      return utils_2.mergeTransactions;
    } });
    Object.defineProperty(exports, "isAddressObject", { enumerable: true, get: function() {
      return utils_2.isAddressObject;
    } });
    Object.defineProperty(exports, "LT_COLLATOR", { enumerable: true, get: function() {
      return utils_2.LT_COLLATOR;
    } });
    var isBrowser = typeof window !== "undefined" && typeof window.document !== "undefined";
    var ensurePageLoaded;
    if (!isBrowser || document.readyState === "complete") {
      ensurePageLoaded = Promise.resolve();
    } else {
      ensurePageLoaded = new Promise((resolve) => {
        window.addEventListener("load", () => {
          resolve();
        });
      });
    }
    var getProvider = () => isBrowser ? window.__ever || window.ton : void 0;
    async function hasEverscaleProvider() {
      if (!isBrowser) {
        return false;
      }
      await ensurePageLoaded;
      return window.__hasEverscaleProvider === true || window.hasTonProvider === true;
    }
    exports.hasEverscaleProvider = hasEverscaleProvider;
    var ProviderRpcClient = class {
      constructor(properties = {}) {
        this._subscriptions = {
          connected: /* @__PURE__ */ new Map(),
          disconnected: /* @__PURE__ */ new Map(),
          transactionsFound: /* @__PURE__ */ new Map(),
          contractStateChanged: /* @__PURE__ */ new Map(),
          messageStatusUpdated: /* @__PURE__ */ new Map(),
          networkChanged: /* @__PURE__ */ new Map(),
          permissionsChanged: /* @__PURE__ */ new Map(),
          loggedOut: /* @__PURE__ */ new Map()
        };
        this._contractSubscriptions = /* @__PURE__ */ new Map();
        this._properties = properties;
        const self = this;
        class ProviderContract extends contract.Contract {
          constructor(abi, address) {
            super(self, abi, address);
          }
        }
        this.Contract = ProviderContract;
        class ProviderSubscriber extends subscriber.Subscriber {
          constructor() {
            super(self);
          }
        }
        this.Subscriber = ProviderSubscriber;
        this._api = new Proxy({}, {
          get: (_object, method) => (params) => {
            if (this._provider != null) {
              return this._provider.request({ method, params });
            } else {
              throw new ProviderNotInitializedException();
            }
          }
        });
        if (properties.forceUseFallback === true) {
          this._initializationPromise = properties.fallback != null ? properties.fallback().then((provider) => {
            this._provider = provider;
          }) : Promise.resolve();
        } else {
          this._provider = getProvider();
          if (this._provider != null) {
            this._initializationPromise = Promise.resolve();
          } else {
            this._initializationPromise = hasEverscaleProvider().then((hasProvider) => new Promise((resolve) => {
              if (!hasProvider) {
                return resolve();
              }
              this._provider = getProvider();
              if (this._provider != null) {
                resolve();
              } else {
                const eventName = window.__hasEverscaleProvider === true ? "ever#initialized" : "ton#initialized";
                window.addEventListener(eventName, (_) => {
                  this._provider = getProvider();
                  resolve();
                });
              }
            })).then(async () => {
              if (this._provider == null && properties.fallback != null) {
                this._provider = await properties.fallback();
              }
            });
          }
        }
        this._initializationPromise.then(() => {
          if (this._provider != null) {
            this._registerEventHandlers(this._provider);
          }
        });
      }
      /**
       * Checks whether this page has injected Everscale provider or
       * there is a fallback provider.
       */
      async hasProvider() {
        if (this._properties.fallback != null) {
          return true;
        }
        return hasEverscaleProvider();
      }
      /**
       * Waits until provider api will be available. Calls `fallback` if no provider was found
       *
       * @throws ProviderNotFoundException when no provider found
       */
      async ensureInitialized() {
        await this._initializationPromise;
        if (this._provider == null) {
          throw new ProviderNotFoundException();
        }
      }
      /**
       * Whether provider api is ready
       */
      get isInitialized() {
        return this._provider != null;
      }
      /**
       * Raw provider
       */
      get raw() {
        if (this._provider != null) {
          return this._provider;
        } else {
          throw new ProviderNotInitializedException();
        }
      }
      /**
       * Raw provider api
       */
      get rawApi() {
        return this._api;
      }
      /**
       * Creates typed contract wrapper.
       *
       * @param abi Readonly object (must be declared with `as const`)
       * @param address Default contract address
       *
       * @deprecated `new ever.Contract(abi, address)` should be used instead
       */
      createContract(abi, address) {
        return new this.Contract(abi, address);
      }
      /**
       * Creates subscriptions group
       *
       * @deprecated `new ever.Subscriber()` should be used instead
       */
      createSubscriber() {
        return new this.Subscriber();
      }
      /**
       * Requests new permissions for current origin.
       * Shows an approval window to the user.
       * Will overwrite already existing permissions
       *
       * ---
       * Required permissions: none
       */
      async requestPermissions(args) {
        await this.ensureInitialized();
        const result = await this._api.requestPermissions({
          permissions: args.permissions
        });
        return (0, models_1.parsePermissions)(result);
      }
      /**
       * Updates `accountInteraction` permission value
       *
       * ---
       * Requires permissions: `accountInteraction`
       */
      async changeAccount() {
        await this.ensureInitialized();
        await this._api.changeAccount();
      }
      /**
       * Removes all permissions for current origin and stops all subscriptions
       */
      async disconnect() {
        await this.ensureInitialized();
        await this._api.disconnect();
      }
      async subscribe(eventName, params) {
        class SubscriptionImpl {
          constructor(_subscribe, _unsubscribe) {
            this._subscribe = _subscribe;
            this._unsubscribe = _unsubscribe;
            this._listeners = {
              data: [],
              subscribed: [],
              unsubscribed: []
            };
            this._subscribed = false;
            this.subscribe = async () => {
              if (this._subscribed) {
                return;
              }
              this._subscribed = true;
              await this._subscribe(this);
              for (const handler of this._listeners["subscribed"]) {
                handler();
              }
            };
            this.unsubscribe = async () => {
              if (!this._subscribed) {
                return;
              }
              this._subscribed = false;
              await this._unsubscribe();
              for (const handler of this._listeners["unsubscribed"]) {
                handler();
              }
            };
          }
          on(eventName2, listener) {
            this._listeners[eventName2].push(listener);
            return this;
          }
          notify(data) {
            for (const handler of this._listeners["data"]) {
              handler(data);
            }
          }
        }
        const existingSubscriptions = this._subscriptions[eventName];
        const id = (0, utils_1.getUniqueId)();
        switch (eventName) {
          case "connected":
          case "disconnected":
          case "messageStatusUpdated":
          case "networkChanged":
          case "permissionsChanged":
          case "loggedOut": {
            const subscription = new SubscriptionImpl(async (subscription2) => {
              if (existingSubscriptions.has(id)) {
                return;
              }
              existingSubscriptions.set(id, (data) => {
                subscription2.notify(data);
              });
            }, async () => {
              existingSubscriptions.delete(id);
            });
            await subscription.subscribe();
            return subscription;
          }
          case "transactionsFound":
          case "contractStateChanged": {
            if (params == null) {
              throw new Error("Address must be specified for the subscription");
            }
            await this.ensureInitialized();
            const address = params.address.toString();
            const subscription = new SubscriptionImpl(async (subscription2) => {
              if (existingSubscriptions.has(id)) {
                return;
              }
              existingSubscriptions.set(id, (data) => {
                if (data.address.toString() === address) {
                  subscription2.notify(data);
                }
              });
              let contractSubscriptions = this._contractSubscriptions.get(address);
              if (contractSubscriptions == null) {
                contractSubscriptions = /* @__PURE__ */ new Map();
                this._contractSubscriptions.set(address, contractSubscriptions);
              }
              const subscriptionState = {
                state: eventName === "contractStateChanged",
                transactions: eventName === "transactionsFound"
              };
              contractSubscriptions.set(id, subscriptionState);
              const { total, withoutExcluded } = foldSubscriptions(contractSubscriptions.values(), subscriptionState);
              try {
                if (total.transactions !== withoutExcluded.transactions || total.state !== withoutExcluded.state) {
                  await this.rawApi.subscribe({ address, subscriptions: total });
                }
              } catch (e) {
                existingSubscriptions.delete(id);
                contractSubscriptions.delete(id);
                throw e;
              }
            }, async () => {
              existingSubscriptions.delete(id);
              const contractSubscriptions = this._contractSubscriptions.get(address);
              if (contractSubscriptions == null) {
                return;
              }
              const updates = contractSubscriptions.get(id);
              const { total, withoutExcluded } = foldSubscriptions(contractSubscriptions.values(), updates);
              contractSubscriptions.delete(id);
              if (!withoutExcluded.transactions && !withoutExcluded.state) {
                await this.rawApi.unsubscribe({ address });
              } else if (total.transactions !== withoutExcluded.transactions || total.state !== withoutExcluded.state) {
                await this.rawApi.subscribe({ address, subscriptions: withoutExcluded });
              }
            });
            await subscription.subscribe();
            return subscription;
          }
          default: {
            throw new Error(`Unknown event ${eventName}`);
          }
        }
      }
      /**
       * Returns provider api state
       *
       * ---
       * Required permissions: none
       */
      async getProviderState() {
        await this.ensureInitialized();
        const state = await this._api.getProviderState();
        return {
          ...state,
          permissions: (0, models_1.parsePermissions)(state.permissions)
        };
      }
      /**
       * Requests contract balance
       *
       * ---
       * Required permissions: `basic`
       */
      async getBalance(address) {
        const { state } = await this.getFullContractState({
          address
        });
        return state == null ? "0" : state === null || state === void 0 ? void 0 : state.balance;
      }
      /**
       * Requests contract data
       *
       * ---
       * Required permissions: `basic`
       */
      async getFullContractState(args) {
        await this.ensureInitialized();
        return await this._api.getFullContractState({
          address: args.address.toString()
        });
      }
      /**
       * Requests accounts with specified code hash
       *
       * ---
       * Required permissions: `basic`
       */
      async getAccountsByCodeHash(args) {
        await this.ensureInitialized();
        const { accounts, continuation } = await this._api.getAccountsByCodeHash({
          ...args
        });
        return {
          accounts: accounts.map((address) => new utils_1.Address(address)),
          continuation
        };
      }
      /**
       * Requests contract transactions
       *
       * ---
       * Required permissions: `basic`
       */
      async getTransactions(args) {
        await this.ensureInitialized();
        const { transactions, continuation, info } = await this._api.getTransactions({
          ...args,
          address: args.address.toString()
        });
        return {
          transactions: transactions.map(models_1.parseTransaction),
          continuation,
          info
        };
      }
      /**
       * Searches transaction by hash
       *
       * ---
       * Required permissions: `basic`
       */
      async getTransaction(args) {
        await this.ensureInitialized();
        const { transaction } = await this._api.getTransaction({
          ...args
        });
        return {
          transaction: transaction ? (0, models_1.parseTransaction)(transaction) : void 0
        };
      }
      /**
       * Computes contract address from code and init params
       *
       * ---
       * Required permissions: `basic`
       */
      async getExpectedAddress(abi, args) {
        const { address } = await this.getStateInit(abi, args);
        return address;
      }
      /**
       * Computes contract address and state from code and init params
       *
       * ---
       * Required permissions: `basic`
       */
      async getStateInit(abi, args) {
        await this.ensureInitialized();
        const { address, stateInit, hash } = await this._api.getExpectedAddress({
          abi: JSON.stringify(abi),
          ...args,
          initParams: (0, models_1.serializeTokensObject)(args.initParams)
        });
        return {
          address: new utils_1.Address(address),
          stateInit,
          hash
        };
      }
      /**
       * Decodes initial contract data using the specified ABI
       *
       * ---
       * Required permissions: `basic`
       */
      async unpackInitData(abi, data) {
        await this.ensureInitialized();
        const { publicKey, initParams } = await this._api.unpackInitData({
          abi: JSON.stringify(abi),
          data
        });
        return {
          publicKey,
          initParams: (0, models_1.parsePartialTokensObject)(abi.data, initParams)
        };
      }
      /**
       * Computes hash of base64 encoded BOC
       *
       * ---
       * Required permissions: `basic`
       */
      async getBocHash(boc) {
        await this.ensureInitialized();
        return await this._api.getBocHash({
          boc
        }).then(({ hash }) => hash);
      }
      /**
       * Creates base64 encoded BOC
       *
       * ---
       * Required permissions: `basic`
       */
      async packIntoCell(args) {
        await this.ensureInitialized();
        return await this._api.packIntoCell({
          abiVersion: args.abiVersion,
          structure: args.structure,
          data: (0, models_1.serializeTokensObject)(args.data)
        });
      }
      /**
       * Decodes base64 encoded BOC
       *
       * ---
       * Required permissions: `basic`
       */
      async unpackFromCell(args) {
        await this.ensureInitialized();
        const { data } = await this._api.unpackFromCell({
          ...args,
          structure: args.structure
        });
        return {
          data: (0, models_1.parseTokensObject)(args.structure, data)
        };
      }
      /**
       * Extracts public key from raw account state
       *
       * **NOTE:** can only be used on contracts which are deployed and has `pubkey` header
       *
       * ---
       * Required permissions: `basic`
       */
      async extractPublicKey(boc) {
        await this.ensureInitialized();
        const { publicKey } = await this._api.extractPublicKey({
          boc
        });
        return publicKey;
      }
      /**
       * Converts base64 encoded contract code into tvc with default init data
       *
       * ---
       * Required permissions: `basic`
       */
      async codeToTvc(code) {
        await this.ensureInitialized();
        const { tvc } = await this._api.codeToTvc({
          code
        });
        return tvc;
      }
      /**
       * Merges code and data into state init
       *
       * ---
       * Required permissions: `basic`
       */
      async mergeTvc(args) {
        await this.ensureInitialized();
        return await this._api.mergeTvc(args);
      }
      /**
       * Splits base64 encoded state init into code and data
       *
       * ---
       * Required permissions: `basic`
       */
      async splitTvc(tvc) {
        await this.ensureInitialized();
        return await this._api.splitTvc({
          tvc
        });
      }
      /**
       * Merges code and data into state init
       *
       * ---
       * Required permissions: `basic`
       */
      async setCodeSalt(args) {
        let salt;
        if (typeof args.salt === "string") {
          await this.ensureInitialized();
          salt = args.salt;
        } else {
          const { boc } = await this.packIntoCell(args.salt);
          salt = boc;
        }
        return await this._api.setCodeSalt({ code: args.code, salt });
      }
      /**
       * Retrieves salt from code. Returns undefined if code doesn't contain salt
       *
       * ---
       * Required permissions: `basic`
       */
      async getCodeSalt(args) {
        await this.ensureInitialized();
        const { salt } = await this.rawApi.getCodeSalt({
          code: args.code
        });
        return salt;
      }
      /**
       * Adds asset to the selected account
       *
       * ---
       * Requires permissions: `accountInteraction`
       */
      async addAsset(args) {
        await this.ensureInitialized();
        let params;
        switch (args.type) {
          case "tip3_token": {
            params = {
              rootContract: args.params.rootContract.toString()
            };
            break;
          }
          default:
            throw new Error("Unknown asset type");
        }
        return await this._api.addAsset({
          account: args.account.toString(),
          type: args.type,
          params
        });
      }
      async verifySignature(args) {
        await this.ensureInitialized();
        return await this._api.verifySignature(args);
      }
      /**
       * Signs arbitrary data.
       *
       * NOTE: hashes data before signing. Use `signDataRaw` to sign without hash.
       *
       * ---
       * Requires permissions: `accountInteraction`
       */
      async signData(args) {
        await this.ensureInitialized();
        return await this._api.signData(args);
      }
      /**
       * Signs arbitrary data without hashing it
       *
       * ---
       * Requires permissions: `accountInteraction`
       */
      async signDataRaw(args) {
        await this.ensureInitialized();
        return await this._api.signDataRaw(args);
      }
      /**
       * Encrypts arbitrary data with specified algorithm for each specified recipient
       *
       * ---
       * Requires permissions: `accountInteraction`
       */
      async encryptData(args) {
        await this.ensureInitialized();
        const { encryptedData } = await this._api.encryptData(args);
        return encryptedData;
      }
      /**
       * Decrypts encrypted data. Returns base64 encoded data
       *
       * ---
       * Requires permissions: `accountInteraction`
       */
      async decryptData(encryptedData) {
        await this.ensureInitialized();
        const { data } = await this._api.decryptData({ encryptedData });
        return data;
      }
      /**
       * Sends an internal message from the user account.
       * Shows an approval window to the user.
       *
       * ---
       * Required permissions: `accountInteraction`
       */
      async sendMessage(args) {
        await this.ensureInitialized();
        const { transaction } = await this._api.sendMessage({
          sender: args.sender.toString(),
          recipient: args.recipient.toString(),
          amount: args.amount,
          bounce: args.bounce,
          payload: args.payload ? {
            abi: args.payload.abi,
            method: args.payload.method,
            params: (0, models_1.serializeTokensObject)(args.payload.params)
          } : void 0,
          stateInit: args.stateInit
        });
        return {
          transaction: (0, models_1.parseTransaction)(transaction)
        };
      }
      /**
       * Sends an internal message from the user account without waiting for the transaction.
       * Shows an approval window to the user.
       *
       * @see messageStatusUpdated
       *
       * ---
       * Required permissions: `accountInteraction`
       */
      async sendMessageDelayed(args) {
        await this.ensureInitialized();
        const transactions = new utils_1.DelayedTransactions();
        const subscription = await this.subscribe("messageStatusUpdated");
        subscription.on("data", (data) => {
          if (!data.address.equals(args.sender)) {
            return;
          }
          transactions.fillTransaction(data.hash, data.transaction);
        });
        const { message } = await this._api.sendMessageDelayed({
          sender: args.sender.toString(),
          recipient: args.recipient.toString(),
          amount: args.amount,
          bounce: args.bounce,
          payload: args.payload ? {
            abi: args.payload.abi,
            method: args.payload.method,
            params: (0, models_1.serializeTokensObject)(args.payload.params)
          } : void 0,
          stateInit: args.stateInit
        }).catch((e) => {
          subscription.unsubscribe().catch(console.error);
          throw e;
        });
        const transaction = transactions.waitTransaction(args.sender, message.hash).finally(() => subscription.unsubscribe().catch(console.error));
        return {
          messageHash: message.hash,
          expireAt: message.expireAt,
          transaction
        };
      }
      _registerEventHandlers(provider) {
        const knownEvents = {
          connected: (data) => data,
          disconnected: (data) => data,
          transactionsFound: (data) => ({
            address: new utils_1.Address(data.address),
            transactions: data.transactions.map(models_1.parseTransaction),
            info: data.info
          }),
          contractStateChanged: (data) => ({
            address: new utils_1.Address(data.address),
            state: data.state
          }),
          messageStatusUpdated: (data) => ({
            address: new utils_1.Address(data.address),
            hash: data.hash,
            transaction: data.transaction != null ? (0, models_1.parseTransaction)(data.transaction) : void 0
          }),
          networkChanged: (data) => data,
          permissionsChanged: (data) => ({
            permissions: (0, models_1.parsePermissions)(data.permissions)
          }),
          loggedOut: (data) => data
        };
        for (const [eventName, extractor] of Object.entries(knownEvents)) {
          provider.addListener(eventName, (data) => {
            const handlers = this._subscriptions[eventName];
            const parsed = extractor(data);
            for (const handler of handlers.values()) {
              handler(parsed);
            }
          });
        }
      }
    };
    exports.ProviderRpcClient = ProviderRpcClient;
    var ProviderNotFoundException = class extends Error {
      constructor() {
        super("Everscale provider was not found");
      }
    };
    exports.ProviderNotFoundException = ProviderNotFoundException;
    var ProviderNotInitializedException = class extends Error {
      constructor() {
        super("Everscale provider was not initialized yet");
      }
    };
    exports.ProviderNotInitializedException = ProviderNotInitializedException;
    function foldSubscriptions(subscriptions, except) {
      const total = { state: false, transactions: false };
      const withoutExcluded = Object.assign({}, total);
      for (const item of subscriptions) {
        if (withoutExcluded.transactions && withoutExcluded.state) {
          break;
        }
        total.state || (total.state = item.state);
        total.transactions || (total.transactions = item.transactions);
        if (item !== except) {
          withoutExcluded.state || (withoutExcluded.state = item.state);
          withoutExcluded.transactions || (withoutExcluded.transactions = item.transactions);
        }
      }
      return { total, withoutExcluded };
    }
  }
});
export default require_dist();
//# sourceMappingURL=everscale-inpage-provider.js.map
