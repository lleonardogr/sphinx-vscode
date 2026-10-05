record Sale(String region, String product, int quantity, double price) {}

void main() {
    int n = Integer.parseInt(IO.readln().trim());
    List<String> lines = Stream.generate(IO::readln).limit(n).toList();

    // TODO: transforme as linhas em records Sale e imprima o relatório com streams
}
