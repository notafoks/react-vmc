# react-vmc

View models для React на базе MobX и tsyringe.

## Разработка

```sh
npm install
npm run dev         # сборка в режиме watch
npm run typecheck   # проверка типов
npm run build       # ESM, CommonJS, типы и source maps в dist/
npm run check       # проверка типов и сборка
npm run pack:check  # проверка содержимого npm-пакета без публикации
```

Перед упаковкой и публикацией `prepack` автоматически проверяет типы и собирает
библиотеку. В пакет входят `dist/`, README и package.json.
`package-lock.json` фиксирует зависимости для воспроизводимой установки через `npm ci`.

## Подключение в приложении

```sh
npm install react-vmc react mobx mobx-react-lite tsyringe reflect-metadata
```

React, MobX, mobx-react-lite и tsyringe используются как peer dependencies,
чтобы библиотека и приложение работали с общими экземплярами зависимостей.
Для веб-приложения также нужен `react-dom` той же версии, что и React.

В точке входа приложения подключите полифилл до импорта моделей и библиотеки:

```ts
import 'reflect-metadata'
```

Для моделей с декораторами добавьте в tsconfig приложения:

```json
{
  "compilerOptions": {
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    "useDefineForClassFields": false
  }
}
```

Если приложение компилируется через Babel, SWC или другой транспилятор,
настройте в нём legacy-декораторы и генерацию metadata для DI.
Требования tsyringe: https://github.com/microsoft/tsyringe#installation.
В сборке самой библиотеки metadata обрабатывается через SWC.

Публичные экспорты: `ViewModelNext`, `withViewModel`, `wvm`, `vm`,
а также типы `WithVM` и `VMC`.

Версия пакета начинается с `0.1.0`. Лицензия пока `UNLICENSED`;
автор, репозиторий и выбранная лицензия добавляются после их определения.
