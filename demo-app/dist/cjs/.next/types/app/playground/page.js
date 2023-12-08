// File: /Users/hktouw/Repos/open-truss/open-truss/demo-app/src/app/playground/page.tsx
import * as entry from '../../../../src/app/playground/page.js';
// Check that the entry is a valid entry
checkFields();
// Check the prop type of the entry function
checkFields();
// Check the arguments and return type of the generateMetadata function
if ('generateMetadata' in entry) {
    checkFields();
    checkFields();
}
// Check the arguments and return type of the generateStaticParams function
if ('generateStaticParams' in entry) {
    checkFields();
    checkFields();
}
function checkFields() { }
