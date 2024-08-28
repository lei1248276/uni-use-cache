import {
  type Ref,
  type ShallowRef,
  type UnwrapNestedRefs,
  type ShallowReactive,
  isRef,
  isReactive,
  watch
} from 'vue'

type Reactive<T extends object> = UnwrapNestedRefs<T>

/**
 * @description 获取缓存数据，修改数据会自动更新缓存（默认为异步获取缓存数据）
 * @param key 缓存key
 * @param initial 初始值，获取到缓存后会更新初始值
 * @param sync 是否同步获取缓存，默认false
 * @example ```typescript
 * const data = useCache('key', ref())
 * const data1 = useCache('key1', ref(), true)
 * const data2 = useCache('key2', reactive({}))
 * ```
 */
export default function useCache<
  T extends Ref<any | undefined> | ShallowRef<any | undefined> | Reactive<object> | ShallowReactive<object>
>(key: string, initial: T, sync = false): T {
  if (sync) {
    const data = uni.getStorageSync(key)
    setData(data, initial)
    watch(initial, (value) => {
      uni.setStorage({
        key,
        data: value
      })
    }, { flush: 'post', deep: true })
  } else {
    uni.getStorage({
      key,
      success({ data }) {
        setData(data, initial)
      },
      complete() {
        watch(initial, (value) => {
          uni.setStorage({
            key,
            data: value
          })
        }, { flush: 'post', deep: true })
      }
    })
  }

  return initial
}

function setData(data: any, initial: any) {
  if (!data) return

  if (isRef(initial)) {
    initial.value = data
    return
  }

  if (isReactive(initial)) {
    Array.isArray(data) && Array.isArray(initial)
      ? data.forEach((v, i) => { initial[i] = v })
      : Object.assign(initial, data)
    return
  }
}
