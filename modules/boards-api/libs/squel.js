const squel = require('squel').useFlavour('postgres');

squel.cls.DefaultQueryBuilderOptions.autoQuoteAliasNames = true;
squel.cls.DefaultQueryBuilderOptions.fieldAliasQuoteCharacter = '"';
squel.cls.DefaultQueryBuilderOptions.tableAliasQuoteCharacter = '"';
// squel.cls.DefaultQueryBuilderOptions.separator = '\n';

module.exports = squel;
