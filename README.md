## Nicer: Your JavaScript Code's New Best Friend

<h1 style="font-size: 100px; text-align: center; margin: 10px;"> 😁</h1>

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
nice <file>
```

**Example:**

```bash
nice my_code.js
```

```bash
nice my_code.ts
```

**Editor Integration:**

Specific instructions for integrating Nicer with your editor will vary. Please refer to your editor's documentation for details on installing and configuring code formatters.

### Configuration

Nicer allows you to customize its formatting behavior through a configuration file. You can create a `.nicerrc` file in your project's root directory to define your preferences.

**Example Configuration (.nicerrc):**

```json
{
 "tabSize": 2,
 "semicolons": true,
 "singleQuotes": false,
 "newlineBraces": false
}
```

**More configuration options and details can be found in the Nicer documentation.**

### Documentation and Support

For more detailed information on Nicer's features, configuration options, and usage examples, please refer to the official documentation:

**_Nicer Documentation_** (Add documentation URL here)

We hope Nicer helps you write cleaner, more maintainable JavaScript code!
