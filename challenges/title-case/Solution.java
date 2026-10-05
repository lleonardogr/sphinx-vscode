void main() {
    String sentence = IO.readln().trim();
    String[] words = sentence.split(" ");
    for (int i = 0; i < words.length; i++) {
        words[i] = words[i].substring(0, 1).toUpperCase() + words[i].substring(1).toLowerCase();
    }
    IO.println(String.join(" ", words));
}
