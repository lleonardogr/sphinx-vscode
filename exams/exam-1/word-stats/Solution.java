void main() {
    String line = IO.readln();
    String[] words = line.trim().split(" +");
    String longest = "";
    for (String word : words) {
        if (word.length() > longest.length()) longest = word;
    }
    int vowels = 0;
    String lower = line.toLowerCase();
    for (int i = 0; i < lower.length(); i++) {
        if ("aeiou".indexOf(lower.charAt(i)) >= 0) vowels++;
    }
    IO.println("Words: " + words.length);
    IO.println("Longest: " + longest);
    IO.println("Vowels: " + vowels);
}
