void main() {
    String text = IO.readln().toLowerCase();
    int vowels = 0;
    for (char c : text.toCharArray()) {
        switch (c) {
            case 'a', 'e', 'i', 'o', 'u' -> vowels++;
            default -> { }
        }
    }
    IO.println(vowels);
}
