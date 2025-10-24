# Biotech Snap Newsletter Generator

Simple tool to generate HTML newsletters from JSON data.

## Quick Start

### First Time Setup

1. **Install Node.js** (if not already installed)
   - Download from [nodejs.org](https://nodejs.org/)

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **You're ready!**

---

## Creating a New Edition

### Step 1: Prepare Your Content

1. Download the word doc and images supplied by Joachim.
3. Upload the images, taking note of the image urls.
2. Upload the Word doc and newsletter-template.json files to an LLM (ChatGPT, Claude, etc.)
3. Ask the LLM: "Convert this to match the newsletter-template.json format"
4. Copy the JSON output

### Step 2: Add JSON to Project

1. Open `data/latest-edition.json` in a text editor
2. Paste your JSON content
3. Save the file

### Step 3: Generate Newsletter

1. **Double-click `create-edition.bat`**
2. The script will:
   - ✓ Validate your JSON
   - ✓ Generate the HTML newsletter
   - ✓ Save it to `editions/` folder with timestamp
   
### Step 4: Use the Content
1. Create the edition in mgmt
2. Paste the output HTMl into a WYSIWYG sections
3. Paste in the image urls you saved earlier
4. Check the content against the original word doc

That's it! 🎉

---

## Folder Structure

```
📁 data/
   └── latest-edition.json        ← Put your newsletter JSON here

📁 editions/
   └── newsletter_YYYYMMDD.html   ← Generated newsletters appear here

📁 templates/
   └── newsletter-template.html   ← HTML design (don't change)

📄 create-edition.bat             ← Double-click to generate!
```

---

## Reference Files

- **`data/newsletter-template.json`** - Empty template showing all available fields
- **`data/newsletter-example.json`** - Complete example with all sections filled

Use these as references when creating new editions.

---

## Troubleshooting

**"data\latest-edition.json not found"**
- Make sure your JSON file is saved in the `data/` folder
- Make sure it's named exactly `latest-edition.json`

**"Validation failed"**
- Check the error messages - they tell you exactly what's missing
- Compare your JSON to the template
- Common issues: missing required fields, invalid border colors

**Newsletter looks wrong**
- Open the HTML file in a browser to preview
- Check for missing images or broken links
- Verify image paths in your JSON

---

## Tips for LLMs

When asking an LLM to convert your Word doc to JSON, give it these instructions:

```
Please convert this newsletter content to JSON format matching this template:
[paste newsletter-template.json]

Requirements:
- Keep all HTML formatting in content fields (<strong>, <a>, <br>)
- Use proper link styling: style="color: #007bff; text-decoration: underline;"
- Valid border colors: green, blue, red, yellow, purple
- Preserve all sections: intro, stories, snippets, speed_read, tour_operator
```

---

## Support

For issues or questions, check:
1. Validation error messages (they're specific!)
2. Template and example files in `data/` folder
3. Make sure Node.js and dependencies are installed