void main() {
    String line = new Scanner(System.in).nextLine().trim();
    Map<Integer, String> byLength = Arrays.stream(line.split(" "))
            .collect(Collectors.groupingBy(String::length, TreeMap::new, Collectors.joining(", ")));
    byLength.forEach((length, words) -> IO.println(length + ": " + words));
}
