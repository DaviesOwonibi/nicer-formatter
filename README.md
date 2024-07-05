## Nicer: Your JavaScript Code's New Best Friend

<h1 style="font-size: 100px; text-align: center; margin: 10px;"> 😁</h1>

Nicer is a JavaScript code formatter designed to make your code more readable, consistent, and aesthetically pleadsing.

<hr>

### Prequisites

- Deno

### Installation

```bash
git clone https://github.com/DaviesOwonibi/nicer-formatter
```

### Usage
**Example:**

```bash
deno run -A main.ts my_code.ts
```

### Configuration
```bash
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