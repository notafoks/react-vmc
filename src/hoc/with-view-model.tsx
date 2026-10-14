import { runInAction } from 'mobx'
import { observer } from 'mobx-react-lite'
import React from 'react'
import { container } from 'tsyringe'
import { ViewModelNext } from '../models'
import { WithVM } from '../types'

type Constructor<T, Arguments extends unknown[] = any[]> = new (...arguments_: Arguments) => T

/**
 * Модель на экземпляр компонента, observable-пропсы и встроенный `observer`.
 * Модель регистрируется через `@viewModel()`. Пропсы доступны после конструктора.
 *
 * @example
 * const Component: React.FC<withVM<PickerModel>> = ({ vm }) => <Text>{vm.title}</Text>
 * export const Picker = withViewModel(PickerModel)<PickerProps>(Component)
 */
export const withViewModel =
  <T extends ViewModelNext>(modelClass: Constructor<T>) =>
  <P extends T['viewProps'] = T['viewProps'], TRef = object>(
    Component: React.FunctionComponent<WithVM<T> & React.RefAttributes<TRef>>,
  ) => {
    const ObservedComponent = observer(Component)

    const WithViewModel = React.memo(
      React.forwardRef<TRef, P>((props, ref) => {
        const modelRef = React.useRef<T | null>(null)
        const previousPropsRef = React.useRef<Readonly<P> | null>(null)

        if (modelRef.current === null) {
          const model = container.resolve(modelClass)

          model.setViewProps(props as P)

          modelRef.current = model
        }

        const model = modelRef.current

        React.useEffect(() => {
          const previousProps = previousPropsRef.current
          previousPropsRef.current = props as P

          runInAction(() => {
            model.setViewProps(props as P)
            model.viewDidReceiveProps(props as P, previousProps)
          })
        }, [model, props])

        React.useEffect(() => {
          runInAction(() => {
            model.viewDidMount()
          })

          return () => {
            runInAction(() => {
              model.viewWillUnmount()
            })
            previousPropsRef.current = null
          }
        }, [model])

        return <ObservedComponent vm={model} ref={ref} />
      }),
    )

    WithViewModel.displayName = `withViewModel(${Component.displayName ?? Component.name})`

    return WithViewModel
  }

export const wvm = withViewModel
