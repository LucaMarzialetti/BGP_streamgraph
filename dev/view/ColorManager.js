define([
  "bgpst.lib.d3-amd"
], function(d3){

    var ColorManager = function (env) {
        console.log("=== ColorManager Starting");
        setTimeout(this.initcolors(), 0);
        console.log("=== ColorManager Ready");
    };


    ColorManager.prototype.validcolor = function(lab) {
        var rugub = lab.rgb();
        return ((0 < rugub.r) && (rugub.r < 256)
        && (0 < rugub.g) && (rugub.g < 256)
        && (0 < rugub.b) && (rugub.b < 256));
    };

    ColorManager.prototype.initcolors = function() {
        this.ds = [];
        this.d_sorteds = [];
        this.mindist = 0;
        // the world's slowest loop:
        console.log("=== ColorManager initialize colors");
        this.innerloop(100); //100
        console.log("=== ColorManager "+this.ds.length+" colors loaded!");
    };

    ColorManager.prototype.constraint = function(lab) {
        return lab.l > 45 && lab.l < 75; //45-70
    };

// should probably use a web worker here but don't want a separate file. Use SetTimeout instead.
    ColorManager.prototype.innerloop = function(L) {
        if (L > 0) {
            for (b = -110; b < 100; b+=1) {
                for (a = -100; a < 100; a+=1) {
                    var lab = d3.lab(L, a, b);
                    if (this.validcolor(lab)) {
                        if (this.constraint(lab)) {
                            this.ds.push({
                                lab: lab, // the color
                                nearest: 1000000 // (distance to the nearest chosen color) ** 2
                            });
                        }
                    }
                }
            }
            this.innerloop(L-1);
        }
    };

    ColorManager.prototype.lab_dist = function(lab_1, lab_2) {
        return Math.sqrt(
            (lab_1.l-lab_2.l)*(lab_1.l-lab_2.l) +
            (lab_1.a-lab_2.a)*(lab_1.a-lab_2.a) +
            (lab_1.b-lab_2.b)*(lab_1.b-lab_2.b));
    };

// Order colours by greatest distance from all other selected colors.
    ColorManager.prototype.sortcolors = function(times) {
        if(times>0){
            var d_new = this.select_distant_node();
            this.d_sorteds.push(d_new);
            this.sortcolors(--times);
        }
    };

// find the node that is furthest away from all the currently selected (sorted) nodes.
    ColorManager.prototype.select_distant_node = function() {
        // could optimize this by only updating colours within mindist of selected node
        // (would need an octree or something), and keeping a heap so we don't need to do
        // a full scan for the next colour each time.
        //
        // It's fast enough like this though.

        var selected_node = this.ds[0];
        // find the node with the highest "nearest" value (full scan)
        // -- in other words, the most distant one
        this.ds.forEach(function(d) {
            if (d.nearest > selected_node.nearest)
                selected_node = d;
        });

        // remove it from candidates list
        var index = this.ds.indexOf(selected_node);
        this.ds.splice(index, 1);

        // update the "nearest" value for all the other (nearby) nodes
        var sq = function(x) { return x * x; }

        // each candidate node knows how far away the nearest selected node is.
        // if the newly-selected node is closer, we need to update this distance.
        this.ds.forEach(function(d) {
            dist = (sq(d.lab.a - selected_node.lab.a)
            + sq(d.lab.b - selected_node.lab.b)
            + sq(d.lab.l - selected_node.lab.l));
            if (dist < d.nearest)
                d.nearest = dist;
        });

        return selected_node;
    };

    ColorManager.prototype.furthestLabelColor = function(color) {
        if((color.r*0.2126 + color.g*0.7152 + color.b*0.0722)  < 128)
            return "white";
        else
            return "black";
    };

    return ColorManager;
});

