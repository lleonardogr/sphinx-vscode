record Player(String name, int score) {}

void main() {
    String line = new Scanner(System.in).nextLine().trim();
    List<Player> top = Arrays.stream(line.split(" "))
            .map(entry -> entry.split(":"))
            .map(parts -> new Player(parts[0], Integer.parseInt(parts[1])))
            .sorted(Comparator.comparingInt(Player::score).reversed().thenComparing(Player::name))
            .limit(3)
            .toList();
    IntStream.range(0, top.size())
            .mapToObj(i -> (i + 1) + ". " + top.get(i).name() + " (" + top.get(i).score() + ")")
            .forEach(IO::println);
}
