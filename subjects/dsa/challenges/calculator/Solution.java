int precedence(char op) {
    return op == '*' || op == '/' ? 2 : op == '+' || op == '-' ? 1 : 0;
}

/** Pops an operator and two numbers, and pushes the result. */
void apply(Deque<Long> numbers, Deque<Character> operators) {
    char op = operators.pop();
    long right = numbers.pop();
    long left = numbers.pop();
    numbers.push(switch (op) {
        case '+' -> left + right;
        case '-' -> left - right;
        case '*' -> left * right;
        default -> left / right; // throws ArithmeticException on zero
    });
}

long evaluate(String s) {
    Deque<Long> numbers = new ArrayDeque<>();
    Deque<Character> operators = new ArrayDeque<>();
    int i = 0;
    while (i < s.length()) {
        char c = s.charAt(i);
        if (Character.isDigit(c)) {
            long value = 0;
            while (i < s.length() && Character.isDigit(s.charAt(i))) {
                value = value * 10 + (s.charAt(i) - '0');
                i++;
            }
            numbers.push(value);
            continue;
        }
        if (c == '(') {
            operators.push(c);
        } else if (c == ')') {
            while (operators.peek() != '(') {
                apply(numbers, operators);
            }
            operators.pop();
        } else if (precedence(c) > 0) {
            while (!operators.isEmpty() && precedence(operators.peek()) >= precedence(c)) {
                apply(numbers, operators);
            }
            operators.push(c);
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
