import React from 'react'

export type WithVM<T> = { vm: T }
export type VMC<T> = React.FC<WithVM<T>>
