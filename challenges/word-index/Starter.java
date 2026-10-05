void main() {
    int n = Integer.parseInt(IO.readln().trim());
    List<String> lines = Stream.generate(IO::readln).limit(n).toList();

    // TODO: build the index (word -> line numbers) with streams and print it
}
