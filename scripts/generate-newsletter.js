const fs = require('fs');
const Handlebars = require('handlebars');

// Register helper for equality comparison (used for border colors)
Handlebars.registerHelper('eq', function(a, b) {
  return a === b;
});

// Main function to generate newsletter
function generateNewsletter(jsonPath, templatePath, outputPath) {
  try {
    // Read the JSON data file
    console.log('Reading JSON data from:', jsonPath);
    const jsonData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    
    // Read the HTML template
    console.log('Reading HTML template from:', templatePath);
    const templateSource = fs.readFileSync(templatePath, 'utf8');
    
    // Compile the template
    console.log('Compiling template...');
    const template = Handlebars.compile(templateSource);
    
    // Generate the HTML by merging template with data
    console.log('Generating newsletter HTML...');
    const html = template(jsonData.newsletter);
    
    // Write the output file
    console.log('Writing output to:', outputPath);
    fs.writeFileSync(outputPath, html, 'utf8');
    
    console.log('✓ Newsletter generated successfully!');
    console.log(`Output saved to: ${outputPath}`);
    
    // Display some stats
    const stats = {
      sponsor: jsonData.newsletter.sponsor.enabled ? 'Yes' : 'No',
      snippets: jsonData.newsletter.snippets?.length || 0,
      speedRead: jsonData.newsletter.speed_read?.length || 0,
      events: jsonData.newsletter.tour_operator?.length || 0,
      snapAgain: jsonData.newsletter.snap_again?.headline ? 'Yes' : 'No'
    };
    
    console.log('\nNewsletter contents:');
    console.log(`- Sponsor sections: ${stats.sponsor}`);
    console.log(`- Snippets: ${stats.snippets}`);
    console.log(`- Speed read items: ${stats.speedRead}`);
    console.log(`- Events: ${stats.events}`);
    console.log(`- Snap Again section: ${stats.snapAgain}`);
    
  } catch (error) {
    console.error('Error generating newsletter:', error.message);
    process.exit(1);
  }
}

// Command line usage
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.length < 3) {
    console.log('Usage: node generate-newsletter.js <json-file> <template-file> <output-file>');
    console.log('Example: node generate-newsletter.js newsletter-data.json newsletter-template.html output.html');
    process.exit(1);
  }
  
  const [jsonPath, templatePath, outputPath] = args;
  generateNewsletter(jsonPath, templatePath, outputPath);
}

module.exports = { generateNewsletter };