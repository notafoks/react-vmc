import { action, makeObservable, observable } from 'mobx'

/**
 * Базовая модель для `withViewModel`. HOC передаёт начальные пропсы после создания модели
 * через DI и до первого рендера компонента, затем синхронизирует их изменения.
 * Делегаты вызываются внутри MobX action; завершение async-делегатов не ожидается.
 */
export abstract class ViewModelNext<P extends object = object> {
  @observable.shallow
  public viewProps: P = {} as P

  constructor() {
    makeObservable(this, undefined, { autoBind: true })
  }

  /** Обновляет пропсы на месте, включая удаление исчезнувших полей. */
  @action.bound
  public setViewProps(viewProps: P): void {
    for (const key of Object.keys(this.viewProps) as (keyof P)[]) {
      if (!Object.prototype.hasOwnProperty.call(viewProps, key)) delete this.viewProps[key]
    }

    for (const key of Object.keys(viewProps) as (keyof P)[]) {
      if (
        !Object.prototype.hasOwnProperty.call(this.viewProps, key) ||
        !Object.is(this.viewProps[key], viewProps[key])
      ) {
        this.viewProps[key] = viewProps[key]
      }
    }
  }

  /**
   * Вызывается после синхронизации пропсов в React effect, до `viewDidMount`
   * при первом получении. Предыдущие пропсы в первом вызове равны `null`.
   */
  public viewDidReceiveProps(_viewProps: Readonly<P>, _previousProps: Readonly<P> | null): void | Promise<void> {}

  /** Вызывается в mount effect после первого получения пропсов. */
  public viewDidMount(): void | Promise<void> {}

  /** Вызывается при очистке mount effect; здесь освобождаются ресурсы модели. */
  public viewWillUnmount(): void | Promise<void> {}
}
