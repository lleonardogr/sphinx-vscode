import java.util.Scanner;

public class Main {

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int r = Integer.parseInt(scanner.nextLine().trim());
        String[] names = new String[r];
        String[] types = new String[r];
        String[] values = new String[r];
        for (int i = 0; i < r; i++) {
            String[] record = scanner.nextLine().trim().split(" ");
            names[i] = record[0].toLowerCase();
            types[i] = record[1];
            values[i] = types[i].equals("CNAME") ? record[2].toLowerCase() : record[2];
        }
        int q = Integer.parseInt(scanner.nextLine().trim());
        for (int i = 0; i < q; i++) {
            String name = scanner.nextLine().trim().toLowerCase();
            String chain = name;
            String visited = " " + name + " ";
            String answer = null;
            while (answer == null) {
                String ips = "";
                String next = null;
                for (int k = 0; k < r; k++) {
                    if (names[k].equals(name)) {
                        if (types[k].equals("CNAME")) {
                            next = values[k];
                        } else {
                            ips += (ips.isEmpty() ? "" : ", ") + values[k];
                        }
                    }
                }
                if (!ips.isEmpty()) {
                    answer = ips;
                } else if (next == null) {
                    answer = "NXDOMAIN";
                } else if (visited.contains(" " + next + " ")) {
                    chain += " -> " + next;
                    answer = "LOOP";
                } else {
                    chain += " -> " + next;
                    visited += next + " ";
                    name = next;
                }
            }
            System.out.println(chain + " -> " + answer);
        }
    }
}
