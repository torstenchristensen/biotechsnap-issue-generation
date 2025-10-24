const fs = require('fs');

function validateNewsletter(jsonPath) {
  console.log('Validating newsletter data...\n');
  
  let data;
  let errors = [];
  let warnings = [];
  
  // Try to parse JSON
  try {
    const fileContent = fs.readFileSync(jsonPath, 'utf8');
    data = JSON.parse(fileContent);
  } catch (error) {
    console.error('❌ Invalid JSON file:', error.message);
    process.exit(1);
  }
  
  const n = data.newsletter;
  
  if (!n) {
    errors.push('Missing "newsletter" root object');
    console.error('❌ Invalid structure: Missing "newsletter" root object');
    process.exit(1);
  }
  
  // Check required sections
  if (!n.intro || !n.intro.message) {
    errors.push('Missing intro message');
  }
  
  // Check stories array (new structure)
  if (!n.stories || n.stories.length === 0) {
    errors.push('Missing stories array - need at least one story');
  } else {
    // Validate first story (SNAPSHOT)
    const snapshot = n.stories[0];
    if (!snapshot.headline) {
      errors.push('First story (SNAPSHOT) missing headline');
    }
    if (!snapshot.lead_paragraph) {
      errors.push('First story (SNAPSHOT) missing lead_paragraph');
    }
    if (!snapshot.subsections || snapshot.subsections.length === 0) {
      errors.push('First story (SNAPSHOT) missing subsections');
    } else {
      // Check for important subsections
      const subsectionTitles = snapshot.subsections.map(s => s.title.toLowerCase());
      if (!subsectionTitles.some(t => t.includes('matter'))) {
        warnings.push('First story missing "Why it matters" subsection');
      }
    }
    
    // Validate second story if exists (SNAP AGAIN)
    if (n.stories.length > 1) {
      const snapAgain = n.stories[1];
      if (!snapAgain.headline) {
        warnings.push('Second story (SNAP AGAIN) missing headline');
      }
      if (!snapAgain.lead_paragraph) {
        warnings.push('Second story (SNAP AGAIN) missing lead_paragraph');
      }
    }
  }
  
  // Check sponsor section if enabled
  if (n.sponsor && n.sponsor.enabled === true) {
    if (!n.sponsor.banner || !n.sponsor.banner.image_url) {
      warnings.push('Sponsor enabled but missing banner image_url');
    }
    if (!n.sponsor.section || !n.sponsor.section.sponsor_name) {
      warnings.push('Sponsor enabled but missing sponsor_name');
    }
    if (!n.sponsor.section || !n.sponsor.section.headline) {
      warnings.push('Sponsor enabled but missing sponsor headline');
    }
  }
  
  // Check snippets
  if (!n.snippets || n.snippets.length === 0) {
    warnings.push('No snippets found - newsletter will look incomplete');
  } else {
    n.snippets.forEach((snippet, i) => {
      if (!snippet.title) {
        warnings.push(`Snippet ${i + 1} missing title`);
      }
      if (!snippet.content) {
        warnings.push(`Snippet ${i + 1} missing content`);
      }
      const validColors = ['green', 'blue', 'red', 'yellow', 'purple'];
      if (snippet.border_color && !validColors.includes(snippet.border_color)) {
        warnings.push(`Snippet ${i + 1} has invalid border_color: ${snippet.border_color} (valid: green, blue, red, yellow, purple)`);
      }
    });
  }
  
  // Check speed read
  if (!n.speed_read || n.speed_read.length === 0) {
    warnings.push('No speed read items found');
  } else {
    n.speed_read.forEach((item, i) => {
      if (!item.company_name) {
        warnings.push(`Speed read item ${i + 1} missing company_name`);
      }
      if (!item.content) {
        warnings.push(`Speed read item ${i + 1} missing content`);
      }
    });
  }
  
  // Check tour operator
  if (!n.tour_operator || n.tour_operator.length === 0) {
    warnings.push('No events found in tour operator');
  } else {
    n.tour_operator.forEach((event, i) => {
      if (!event.location) {
        warnings.push(`Event ${i + 1} missing location`);
      }
      if (!event.date) {
        warnings.push(`Event ${i + 1} missing date`);
      }
      if (!event.event_name) {
        warnings.push(`Event ${i + 1} missing event_name`);
      }
      if (!event.event_url) {
        warnings.push(`Event ${i + 1} missing event_url`);
      }
    });
  }
  
  // Check for common issues
  const allContent = JSON.stringify(data);
  
  if (allContent.includes('[IMAGE_URL]') || allContent.includes('[Insert') || allContent.includes('[Enter ')) {
    errors.push('Found placeholder text that needs to be replaced');
  }
  
  // Check for URLs without protocol
  if (allContent.match(/href="[^h"]/)) {
    warnings.push('Some URLs might be missing http:// or https://');
  }
  
  // Display results
  console.log('='.repeat(60));
  
  if (errors.length === 0 && warnings.length === 0) {
    console.log('✅ Validation passed! No issues found.\n');
    console.log('Newsletter structure:');
    console.log(`  - Sponsor: ${n.sponsor?.enabled ? 'Yes' : 'No'}`);
    console.log(`  - Stories: ${n.stories?.length || 0}`);
    console.log(`  - Snippets: ${n.snippets?.length || 0}`);
    console.log(`  - Speed read: ${n.speed_read?.length || 0}`);
    console.log(`  - Events: ${n.tour_operator?.length || 0}`);
    return true;
  }
  
  if (errors.length > 0) {
    console.log('❌ ERRORS (must fix):');
    errors.forEach(err => console.log(`   - ${err}`));
    console.log();
  }
  
  if (warnings.length > 0) {
    console.log('⚠️  WARNINGS (recommended to fix):');
    warnings.forEach(warn => console.log(`   - ${warn}`));
    console.log();
  }
  
  console.log('='.repeat(60));
  
  if (errors.length > 0) {
    console.log('\n❌ Validation failed. Please fix errors before generating.');
    process.exit(1);
  } else {
    console.log('\n⚠️  Validation passed with warnings. Newsletter can be generated.');
    return true;
  }
}

// Command line usage
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log('Usage: node validate-json.js <json-file>');
    console.log('Example: node validate-json.js newsletter-data.json');
    process.exit(1);
  }
  
  validateNewsletter(args[0]);
}

module.exports = { validateNewsletter };