record Grade(String student, String course, int score) {}

void main() {
    int n = Integer.parseInt(IO.readln().trim());
    List<String> lines = Stream.generate(IO::readln).limit(n).toList();

    // TODO: turn the lines into Grade records and print the four parts of the report with streams
}
