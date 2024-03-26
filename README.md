## Nicer: Your JavaScript Code's New Best Friend

![image](https://github.com/DaviesOwonibi/nicer-formatter/assets/75209599/ca421801-da35-4289-af71-2c6c428e647b)


Nicer is a JavaScript code formatter designed to make your code more readable, consistent, and aesthetically pleasing. It takes your messy, unformatted code and transforms it into a well-structured masterpiece, following a set of configurable rules.

### Features

- **Automatic Formatting:** Simply provide your unformatted JavaScript code, and Nicer will handle the rest.
- **Configurable Options:** Tweak Nicer's formatting rules to match your team's preferences or coding style.
- **Multiple Formatting Styles:** Choose from a variety of predefined styles or create your own custom configuration.
- **Integration with Editors and Build Tools:** Nicer can seamlessly integrate with popular code editors and build tools for on-save formatting or pre-commit checks.

### Benefits

- **Improved Readability:** Nicer's consistent formatting makes your code easier to understand for you and your teammates.
- **Reduced Code Reviews:** Less time spent arguing about formatting during code reviews means more time focusing on functionality and logic.
- **Enforced Coding Style:** Nicer helps maintain a consistent code style across your entire project, promoting a clean and professional codebase.

### Installation

There are two main ways to install Nicer:

1. **Node Package Manager (npm):**

```bash
npm install nicer-formatter
```

2. **Yarn:**

```bash
yarn add nicer-formatter
```

### Usage

Once installed, you can use Nicer from the command line or integrate it with your code editor.

**Command Line:**

```bash
nices [options] <file>
```

**Example:**

```bash
nices my_code.js
```

This will format the content of `my_code.js` and print the formatted code to the console.

**Editor Integration:**

Specific instructions for integrating Nicer with your editor will vary. Please refer to your editor's documentation for details on installing and configuring code formatters.

### Configuration

Nicer allows you to customize its formatting behavior through a configuration file. You can create a `.nicerrc` file in your project's root directory to define your preferences.

**Example Configuration (.nicerrc):**

```json
{
  "printWidth": 100,
  "tabWidth": 2,
  "semi": false,
  "trailingComma": "es5"
}
```

These options define the maximum line width, tab size, semicolon usage, and trailing comma behavior.

**More configuration options and details can be found in the Nicer documentation.**

### Documentation and Support

For more detailed information on Nicer's features, configuration options, and usage examples, please refer to the official documentation:

_Nicer Documentation_ (Add documentation URL here)

For bug reports or feature requests, you can visit the Nicer project on GitHub:

_Nicer GitHub Repository_ (Add Github URL here)

We hope Nicer helps you write cleaner, more maintainable JavaScript code!
