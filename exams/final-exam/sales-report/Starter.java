record Sale(String region, String product, int quantity, double price) {}

void main() {
    int n = Integer.parseInt(IO.readln().trim());
    List<String> lines = Stream.generate(IO::readln).limit(n).toList();

    // TODO: turn the lines into Sale records and print the report with streams
}
