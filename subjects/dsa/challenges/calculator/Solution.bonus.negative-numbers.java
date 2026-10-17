int precedence(char op) {
    return switch (op) {
        case '~' -> 3; // a minus sign
        case '*', '/' -> 2;
        case '+', '-' -> 1;
        default -> 0;
    };
}

void apply(Deque<Long> numbers, Deque<Character> operators) {
    char op = operators.pop();
    long right = numbers.pop();
    if (op == '~') {
        numbers.push(-right);
        return;
    }
    long left = numbers.pop();
    numbers.push(switch (op) {
        case '+' -> left + right;
        case '-' -> left - right;
        case '*' -> left * right;
        default -> left / right;
    });
}

long evaluate(String s) {
    Deque<Long> numbers = new ArrayDeque<>();
    Deque<Character> operators = new ArrayDeque<>();
    boolean expectNumber = true; // at the start, after "(" or after an operator
    int i = 0;
    while (i < s.length()) {
        char c = s.charAt(i);
        if (c == ' ') {
            i++;
            continue;
        }
        if (Character.isDigit(c)) {
            long value = 0;
            while (i < s.length() && Character.isDigit(s.charAt(i))) {
                value = value * 10 + (s.charAt(i) - '0');
                i++;
            }
            numbers.push(value);
            expectNumber = false;
            continue;
        }
        if (c == '(') {
            operators.push(c);
            expectNumber = true;
        } else if (c == ')') {
            while (operators.peek() != '(') {
                apply(numbers, operators);
            }
            operators.pop();
            expectNumber = false;
        } else if (c == '-' && expectNumber) {
            operators.push('~'); // a sign: nothing to apply first, it binds to what follows
        } else {
            while (!operators.isEmpty() && precedence(operators.peek()) >= precedence(c)) {
                apply(numbers, operators);
            }
            operators.push(c);
            expectNumber = true;
        }
        i++;
    }
    while (!operators.isEmpty()) {
        apply(numbers, operators);
    }
    return numbers.pop();
}

void main() {
    int q = Integer.parseInt(IO.readln().trim());
    for (int i = 0; i < q; i++) {
        String expression = IO.readln();
        try {
            IO.println(evaluate(expression));
        } catch (ArithmeticException e) {
            IO.println("error: division by zero");
        }
    }
}
