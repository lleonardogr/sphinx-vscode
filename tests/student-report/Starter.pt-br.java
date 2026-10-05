record Grade(String student, String course, int score) {}

void main() {
    int n = Integer.parseInt(IO.readln().trim());
    List<String> lines = Stream.generate(IO::readln).limit(n).toList();

    // TODO: transforme as linhas em records Grade e imprima as quatro partes do relatório com streams
}
