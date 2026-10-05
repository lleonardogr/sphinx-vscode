record Person(String name, int age) {}

void main() {
    String line = IO.readln().trim();
    List<Person> people = new ArrayList<>();
    for (String entry : line.split(" ")) {
        String[] p = entry.split(":");
        people.add(new Person(p[0], Integer.parseInt(p[1])));
    }

    // TODO: ordene pela idade (depois nome) e imprima; depois ordene pelo tamanho do nome (maior primeiro, depois nome) e imprima
}
