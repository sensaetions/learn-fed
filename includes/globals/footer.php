<script src="scripts/bundle.js" type="text/javascript" async></script>
<script>
    //hljs.initHighlightingOnLoad();
    $(document).ready(function() {
        $('pre code').each(function(i, block) {
            hljs.highlightBlock(block);
        });
    });

</script>
</body>

</html>
