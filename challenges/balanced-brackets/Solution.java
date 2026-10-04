void main() {
    Scanner scanner = new Scanner(System.in);
    String text = scanner.nextLine();
    Deque<Character> stack = new ArrayDeque<>();
    boolean balanced = true;
    for (char c : text.toCharArray()) {
        if (c == '(' || c == '[' || c == '{') {
            stack.push(c);
        } else if (c == ')' || c == ']' || c == '}') {
            char expected = c == ')' ? '(' : c == ']' ? '[' : '{';
            if (stack.isEmpty() || stack.pop() != expected) {
                balanced = false;
                break;
            }
        }
    }
    IO.println(balanced && stack.isEmpty() ? "Balanced" : "Not balanced");
}
