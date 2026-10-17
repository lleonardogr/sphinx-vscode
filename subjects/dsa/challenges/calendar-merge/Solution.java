record Meeting(int start, int end) {}

void main() {
    int n = Integer.parseInt(IO.readln().trim());
    List<Meeting> meetings = new ArrayList<>();
    for (int i = 0; i < n; i++) {
        String[] parts = IO.readln().trim().split(" +");
        int start = Integer.parseInt(parts[0]);
        meetings.add(new Meeting(start, start + Integer.parseInt(parts[1])));
    }
    meetings.sort(Comparator.comparingInt(Meeting::start));

    int blocks = 0;
    long busy = 0;
    long longestGap = 0;
    int blockStart = meetings.get(0).start();
    int blockEnd = meetings.get(0).end();
    for (Meeting m : meetings) {
        if (m.start() > blockEnd) {
            blocks++;
            busy += blockEnd - blockStart;
            longestGap = Math.max(longestGap, m.start() - blockEnd);
            blockStart = m.start();
            blockEnd = m.end();
        } else {
            blockEnd = Math.max(blockEnd, m.end());
        }
    }
    blocks++;
    busy += blockEnd - blockStart;

    IO.println("blocks: " + blocks);
    IO.println("busy: " + busy);
    IO.println("longest free gap: " + longestGap);
}
