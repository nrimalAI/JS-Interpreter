# JS-Interpreter

For this project, I wrote an interpreter for a fragment of JavaScript. To code an interpreter, I used a parser within the Ocelot IDE to turn JavaScript’s concrete syntax into an abstract syntax tree.

The function parser.parseExpression parses an expression (e) and the function parser.parseProgram parses a program (p).
parseExpression(str: string): Result<Expr>
parseProgram(str: string): Result<Stmt[]>
