## Contributing

We welcome contributions! If you haven't already, watch the [CLI Getting Started Video](https://youtu.be/Q4EJKXDi3a8) for how we want the project to be setup and take a look at the conventions below to get started contributing.

[![Getting Started Video](https://i9.ytimg.com/vi_webp/Q4EJKXDi3a8/mq1.webp?sqp=CPTKhbUG-oaymwEmCMACELQB8quKqQMa8AEB-AH-CYACxgWKAgwIABABGGQgZChkMA8=&rs=AOn4CLATRoV8G6s9Zl8mY4Pi_mmujrDAww)](https://youtu.be/Q4EJKXDi3a8)

## Overall guidelines | Suggestions

- 🙏 Thank you for your help! Your contributions will motivate developers to do greater things!
- 🥇 Keep it simple. We don't need optimizations right now. We need features!
- 🤖 Built by devs for devs so if you want to make a change to make things better, do it! Make a PR and let rphovley know
  to review it. If it's a big change, a heads up before you start will save some heartache.

## Quick Start

- Have Chrome & Firefox installed
- npm install
- npm run dev

### Conventions

- All files should be typescript and avoid `any` types within reason
- Components should be functional and the name should be PascalCase
- All components should reside in the `components` directory.
- Styling: make use of the `sx` attribute for any material-ui customizations.
- Styling: make use of the appropriate material-ui components for layouts like `Grid` or `Stack` when possible, but `Box` is a great fallback
- Styling: when needing to do your own work with `Box` for layouts, make use of `flex` instead of other css layout types where possible
