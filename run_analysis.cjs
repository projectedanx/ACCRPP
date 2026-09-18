const fs = require('fs');
const ts = require('typescript');

function getComplexity(node) {
    let complexity = 0;
    ts.forEachChild(node, function visit(child) {
        if (
            child.kind === ts.SyntaxKind.IfStatement ||
            child.kind === ts.SyntaxKind.WhileStatement ||
            child.kind === ts.SyntaxKind.DoStatement ||
            child.kind === ts.SyntaxKind.ForStatement ||
            child.kind === ts.SyntaxKind.ForInStatement ||
            child.kind === ts.SyntaxKind.ForOfStatement ||
            child.kind === ts.SyntaxKind.CaseClause ||
            child.kind === ts.SyntaxKind.CatchClause ||
            child.kind === ts.SyntaxKind.ConditionalExpression ||
            child.kind === ts.SyntaxKind.BinaryExpression &&
            (child.operatorToken.kind === ts.SyntaxKind.AmpersandAmpersandToken || child.operatorToken.kind === ts.SyntaxKind.BarBarToken)
        ) {
            complexity++;
        }
        ts.forEachChild(child, visit);
    });
    return complexity + 1; // Base complexity
}

function analyzeFile(filePath) {
    const sourceCode = fs.readFileSync(filePath, 'utf8');
    const sourceFile = ts.createSourceFile(filePath, sourceCode, ts.ScriptTarget.Latest, true);

    let maxComplexity = 0;
    let mostComplexFunction = '';
    let classOrModuleName = '';

    ts.forEachChild(sourceFile, function visit(node) {
        if (node.kind === ts.SyntaxKind.ClassDeclaration) {
            classOrModuleName = node.name ? node.name.text : 'AnonymousClass';
        }

        if (
            node.kind === ts.SyntaxKind.FunctionDeclaration ||
            node.kind === ts.SyntaxKind.MethodDeclaration ||
            node.kind === ts.SyntaxKind.ArrowFunction ||
            node.kind === ts.SyntaxKind.FunctionExpression ||
            node.kind === ts.SyntaxKind.PropertyDeclaration && node.initializer &&
            (node.initializer.kind === ts.SyntaxKind.ArrowFunction || node.initializer.kind === ts.SyntaxKind.FunctionExpression)
        ) {
            const complexity = getComplexity(node);
            let name = 'anonymous';
            if (node.name) name = node.name.text;
            else if (node.parent && node.parent.name) name = node.parent.name.text;

            const fullName = classOrModuleName ? `${classOrModuleName}.${name}` : name;

            if (complexity > 5) {
               console.log(`${filePath}: ${fullName} (Complexity: ${complexity})`);
            }
            if (complexity > maxComplexity) {
                maxComplexity = complexity;
                mostComplexFunction = fullName;
            }
        }
        ts.forEachChild(node, visit);
    });
    return { maxComplexity, mostComplexFunction };
}

const files = ['src/app.component.ts', 'src/services/gemini.service.ts'];
files.forEach(file => {
    const result = analyzeFile(file);
    console.log(`Max complexity in ${file}: ${result.mostComplexFunction} (Complexity: ${result.maxComplexity})`);
});
