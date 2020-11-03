//console.log(parser.parseExpression("1 + 2 * 3"));
//console.log(parser.parseExpression("1 + 2 * * 3"));

function interpExpression(state, e) {
    if (e.kind === 'number' || e.kind === 'boolean') {
        return e.value;
    } else if (e.kind === "variable") {
        let hold = state;
        while (lib220.getProperty(hold, 'link').found) {
            if (lib220.getProperty(hold, e.name).found) {
                break;
            } else {
                hold = lib220.getProperty(hold, "link").value;
            }
        }
        if (!lib220.getProperty(hold, e.name).found) {
            assert(false);
        }
        return lib220.getProperty(hold, e.name).value;
    } else if (e.kind === "operator") {
        if (!lib220.getProperty(e, "e1").found || !lib220.getProperty(e, "e2").found) {
            assert(false);
        }
        let v1 = interpExpression(state, e.e1);
        let v2 = interpExpression(state, e.e2);
        switch (e.op) {
            case "+":
                assert(typeof(v1) === "number");
                assert(typeof(v2) === "number");
                return v1 + v2;
                break;
            case "-":
                assert(typeof(v1) === "number");
                assert(typeof(v2) === "number");
                return v1 - v2;
                break;
            case "*":
                assert(typeof(v1) === "number");
                assert(typeof(v2) === "number");
                return v1 * v2;
                break;
            case "/":
                assert(typeof(v1) === "number");
                assert(typeof(v2) === "number");
                return v1 / v2;
                break;
            case "&&":
                assert(typeof(v1) === "boolean");
                assert(typeof(v2) === "boolean");
                return v1 && v2;
                break;
            case "||":
                assert(typeof(v1) === "boolean");
                assert(typeof(v2) === "boolean");
                return v1 || v2;
                break;
            case ">":
                assert(typeof(v1) === "number");
                assert(typeof(v2) === "number");
                return v1 > v2;
                break;
            case "<":
                assert(typeof(v1) === "number");
                assert(typeof(v2) === "number");
                return v1 < v2;
                break;
            case "===":
                assert(typeof(v1) === typeof(v2));
                return v1 === v2;
                break;
            default:
                assert(false);
        }
    } else {
        assert(false);
    }
}
// The State type is explained further down the document.
// Given a state object and an AST of a statement,
// interpStatement updates the state object and returns nothing
// interpStatement(state: State, s: Stmt): void
// Given the AST of a program,
// interpProgram returns the final state of the program
// interpProgram(p: Stmt[]): State -> type State = { [key: string]: number | boolean }
function interpStatement(state, s) {
    if (s.kind === "let") {
        let value = interpExpression(state, s.expression);
        if (lib220.getProperty(state, s.name).found) {
            assert(false);
        }
        lib220.setProperty(state, s.name, value);
    } else if (s.kind === 'assignment') {
        let value = interpExpression(state, s.expression);
        let hold = state;
        while (lib220.getProperty(hold, 'link').found) {
            if (lib220.getProperty(hold, s.name).found) {
                break;
            } else {
                hold = lib220.getProperty(hold, "link").value;
            }
        }
        if (!lib220.getProperty(hold, s.name).found) {
            assert(false);
        }
        lib220.setProperty(hold, s.name, interpExpression(state, s.expression));
    } else if (s.kind === "if") {
        let value = interpExpression(state, s.test);
        if (value) {
            interpBlock(state, s.truePart);
        } else {
            interpBlock(state, s.falsePart);
        }
    } else if (s.kind === 'while') {
        while (interpExpression(state, s.test)) {
            interpBlock(state, s.body);
        }
    } else if (s.kind === "print") {
        console.log(interpExpression(state, s.expression));
    } else {
        assert(false);
    }
}
// interpBlock(state: State, b: Blocks): void
function interpBlock(state, b) {
    let block = {};
    lib220.setProperty(block, 'link', state);
    for (let i = 0; i < b.length; ++i) {
        interpStatement(block, b[i]);
    }
}
function interpProgram(p) {
    let state = {};
    for (let i = 0; i < p.length; ++i) {
        interpStatement(state, p[i]);
    }
    return state;
}
//--------------------------------------------------------------------------------------

test("multiplication with a variable", function() {
    let r = interpExpression({
        x: 10
    }, parser.parseExpression("x * 2").value);
    assert(r === 20);
});
test("assignment", function() {
    let st = interpProgram(parser.parseProgram("let x = 10; x = 20;").value);
    assert(st.x === 20);
});
test("subtraction with variable", function() {
    let r = interpExpression({
        x: 10
    }, parser.parseExpression("x - 2").value);
    assert(r === 8);
});
test("addition with variable", function() {
    let r = interpExpression({
        x: 10
    }, parser.parseExpression("x + 2").value);
    assert(r === 12);
});