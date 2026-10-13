void main() {
    String sentence = IO.readln();
    StringBuilder result = new StringBuilder();
    boolean startOfWord = true;
    for (char c : sentence.toCharArray()) {
        if (c == ' ') {
            result.append(c);
            startOfWord = true;
        } else {
            result.append(startOfWord ? Character.toUpperCase(c) : Character.toLowerCase(c));
            startOfWord = false;
        }
    }
    IO.println(result);
}
