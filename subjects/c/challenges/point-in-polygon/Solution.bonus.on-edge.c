#include <stdio.h>
#include <math.h>

typedef struct {
    double x, y;
} Point;

typedef struct {
    int n;
    Point vertex[100];
} Polygon;

static double area(const Polygon *p) {
    double twice = 0;
    for (int i = 0; i < p->n; i++) {
        Point a = p->vertex[i], b = p->vertex[(i + 1) % p->n];
        twice += a.x * b.y - b.x * a.y;
    }
    return fabs(twice) / 2;
}

static double perimeter(const Polygon *p) {
    double total = 0;
    for (int i = 0; i < p->n; i++) {
        Point a = p->vertex[i], b = p->vertex[(i + 1) % p->n];
        total += hypot(b.x - a.x, b.y - a.y);
    }
    return total;
}

/* 1 if q lies on the segment from a to b. */
static int on_segment(Point a, Point b, Point q) {
    double cross = (b.x - a.x) * (q.y - a.y) - (b.y - a.y) * (q.x - a.x);
    return cross == 0 && fmin(a.x, b.x) <= q.x && q.x <= fmax(a.x, b.x)
                      && fmin(a.y, b.y) <= q.y && q.y <= fmax(a.y, b.y);
}

/* Ray casting: count the edges that a ray going right from q crosses. 2 means on an edge. */
static int inside(const Polygon *p, Point q) {
    for (int i = 0; i < p->n; i++) {
        if (on_segment(p->vertex[i], p->vertex[(i + 1) % p->n], q)) {
            return 2;
        }
    }
    int crossings = 0;
    for (int i = 0, j = p->n - 1; i < p->n; j = i++) {
        Point a = p->vertex[i], b = p->vertex[j];
        if ((a.y > q.y) != (b.y > q.y)) {
            double x = a.x + (q.y - a.y) * (b.x - a.x) / (b.y - a.y);
            if (q.x < x) {
                crossings++;
            }
        }
    }
    return crossings % 2 == 1;
}

int main(void) {
    Polygon poly;
    scanf("%d", &poly.n);
    for (int i = 0; i < poly.n; i++) {
        scanf("%lf %lf", &poly.vertex[i].x, &poly.vertex[i].y);
    }
    printf("Area: %.2f\nPerimeter: %.2f\n", area(&poly), perimeter(&poly));
    int q;
    scanf("%d", &q);
    for (int i = 0; i < q; i++) {
        Point point;
        scanf("%lf %lf", &point.x, &point.y);
        int where = inside(&poly, point);
        printf("(%g, %g) %s\n", point.x, point.y, where == 2 ? "on edge" : where ? "inside" : "outside");
    }
    return 0;
}
