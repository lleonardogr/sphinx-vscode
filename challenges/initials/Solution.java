void main() {
    String name = IO.readln();
    StringBuilder initials = new StringBuilder();
    for (String word : name.trim().split(" +")) {
        initials.append(Character.toUpperCase(word.charAt(0))).append('.');
    }
    IO.println(initials);
}
