void main() {
    String text = IO.readln().toLowerCase();
    int vowels = 0;
    for (char c : text.toCharArray()) {
        if ("aeiou".indexOf(c) >= 0) {
            vowels++;
        }
    }
    IO.println(vowels);
}
