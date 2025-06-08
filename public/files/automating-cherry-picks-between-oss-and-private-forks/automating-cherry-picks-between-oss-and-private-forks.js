// Add CSS styles for the animations
const styles = `
<style>
.animation {
  width: 100%;
  max-width: 600px;
  height: auto;
  margin: 20px auto;
  display: block;
}

.line {
  stroke: #333;
  stroke-width: 3;
  fill: none;
}

.dotted-line {
  stroke: #999;
  stroke-width: 2;
  stroke-dasharray: 5,5;
  fill: none;
}

.circle {
  stroke: #333;
  stroke-width: 2;
}

.text {
  font-family: Arial, sans-serif;
  font-size: 12px;
  fill: #333;
  text-anchor: middle;
}

.pr-text {
  font-family: monospace;
  font-size: 10px;
  fill: #666;
  text-anchor: middle;
}
</style>
`;

// Add the styles to the document head
if (!document.querySelector('#animation-styles')) {
  const styleElement = document.createElement('div');
  styleElement.id = 'animation-styles';
  styleElement.innerHTML = styles;
  document.head.appendChild(styleElement);
}

// Utility function to wait for element to appear
function waitForElement(selector) {
  return new Promise((resolve) => {
    const element = document.querySelector(selector);
    if (element) {
      resolve(element);
      return;
    }

    const observer = new MutationObserver((mutations) => {
      const element = document.querySelector(selector);
      if (element) {
        observer.disconnect();
        resolve(element);
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  });
}

// Main cherry-pick animation
waitForElement('#main-cherry-pick-upstream').then((e) => {
  e.innerHTML = `<svg viewBox="0 0 1000 300" class="animation" id="pr-cherry-pick-private">
        <!-- Main branch -->
        <line x1="300" y1="250" x2="500" y2="50" class="line" id="main-line"></line>
        <circle cx="450" cy="100" r="8" class="circle" fill="blue" id="main-head"></circle>
        <circle cx="500" cy="50" r="8" class="circle" fill="red" id="main-new-head"></circle>
        <text x="378" y="105" class="text" id="main-head-text">HEAD</text>
        <text x="300" y="230" class="text" transform="rotate(-45, 300, 230)">main</text>

        <!-- Upstream branch -->
        <line x1="500" y1="250" x2="700" y2="50" class="line" id="upstream-line"></line>
        <circle cx="650" cy="100" r="8" class="circle" fill="blue" id="upstream-head"></circle>
        <circle cx="700" cy="50" r="8" class="circle" fill="red" id="upstream-new-head"></circle>
        <text x="628" y="105" class="text" id="upstream-head-text">HEAD</text>
        <text x="500" y="230" class="text" transform="rotate(-45, 500, 230)">upstream</text>

        <!-- Dotted line -->
        <line x1="450" y1="100" x2="650" y2="100" class="dotted-line" id="dotted-line"></line>
        <line x1="500" y1="50" x2="700" y2="50" class="dotted-line" id="dotted-line-new"></line>

        <!-- PR Commit text -->
        <text x="380" y="75" class="pr-text" id="pr-text"> &lt;abcdefg&gt; </text>
        <!-- CherryPick PR Commit text -->
        <text x="700" y="75" class="pr-text" id="cp-pr-text"> CherryPick &lt;abcdefg&gt; </text>
    </svg>`;

  // GSAP Animation
  const timeline = gsap.timeline({
    repeat: -1,
    repeatDelay: 1,
    defaults: {
      duration: 1
    }
  });

  // Step 1: Show PR Commit text
  timeline.from('#pr-text', {
    opacity: 0,
    duration: 1.5
  });

  // Step 2: Extend the main line
  timeline.to('#main-line', {
    duration: 1,
    attr: { x2: 500, y2: 50 }
  });

  // Step 3: Show new HEAD dot on the main branch
  timeline
    .from('#main-new-head', {
      duration: 1,
      opacity: 0
    }, '-=1')
    .to('#main-head-text', {
      duration: 1,
      attr: { x: 428, y: 55 }
    }, '-=1');

  // Step 4: Show CherryPick PR Commit text
  timeline.from('#cp-pr-text', {
    opacity: 0,
    duration: 1.5
  });

  // Step 5: Extend the upstream line
  timeline.to('#upstream-line', {
    duration: 1,
    attr: { x2: 700, y2: 50 }
  });

  // Step 6: Show new HEAD dot on the upstream branch
  timeline
    .from('#upstream-new-head', {
      duration: 1,
      opacity: 0
    }, '-=1')
    .to('#upstream-head-text', {
      duration: 1,
      attr: { x: 678, y: 55 }
    }, '-=1');
});

// Release backport animation
waitForElement('#release-backport-latest').then((e) => {
  e.innerHTML = `<svg viewBox="0 0 1000 300" class="animation" id="pr-backport-private">
        <!-- Main branch -->
        <line x1="300" y1="250" x2="500" y2="50" class="line" id="main-line-bp"></line>
        <circle cx="450" cy="100" r="8" class="circle" fill="blue" id="main-head-bp"></circle>
        <circle cx="500" cy="50" r="8" class="circle" fill="red" id="main-new-head-bp"></circle>
        <text x="428" y="55" class="text" id="main-head-text-bp">HEAD</text>
        <text x="300" y="230" class="text" transform="rotate(-45, 300, 230)">main</text>

        <!-- Upstream branch -->
        <line x1="500" y1="250" x2="700" y2="50" class="line" id="upstream-line-bp"></line>
        <circle cx="650" cy="100" r="8" class="circle" fill="blue" id="upstream-head-bp"></circle>
        <circle cx="700" cy="50" r="8" class="circle" fill="red" id="upstream-new-head-bp"></circle>
        <text x="710" y="55" class="text" id="upstream-head-text-bp">HEAD</text>
        <text x="500" y="230" class="text" transform="rotate(-45, 500, 230)">upstream</text>

        <!-- Dotted line -->
        <line x1="450" y1="100" x2="650" y2="100" class="dotted-line" id="dotted-line-bp"></line>
        <line x1="500" y1="50" x2="700" y2="50" class="dotted-line" id="dotted-line-new-bp"></line>

        <!-- PR Commit text -->
        <text x="380" y="75" class="pr-text" id="pr-text-bp"> &lt;abcdefg&gt; </text>
        <!-- CherryPick PR Commit text -->
        <text x="700" y="75" class="pr-text" id="cp-pr-text-bp"> CherryPick &lt;abcdefg&gt; </text>

        <!-- Release-21.0 branch -->
        <line x1="200" y1="250" x2="300" y2="150" class="line" id="release-line-bp"></line>
        <circle cx="300" cy="150" r="8" class="circle" fill="blue" id="release-head-bp"></circle>
        <circle cx="350" cy="100" r="8" class="circle" fill="red" id="release-new-head-bp"></circle>
        <text x="228" y="155" class="text" id="release-head-text-bp">HEAD</text>
        <text x="200" y="230" transform="rotate(-45, 200, 230)">release-21</text>
        <!-- PR Commit text -->
        <text x="170" y="125" class="pr-text" id="bp-text"> BP of &lt;abcdefg&gt; </text>

        <!-- Latest-21.0 branch -->
        <line x1="700" y1="250" x2="800" y2="150" class="line" id="latest-line-bp"></line>
        <circle cx="800" cy="150" r="8" class="circle" fill="blue" id="latest-head-bp"></circle>
        <circle cx="850" cy="100" r="8" class="circle" fill="red" id="latest-new-head-bp"></circle>
        <text x="728" y="155" class="text" id="latest-head-text-bp">HEAD</text>
        <text x="700" y="230" transform="rotate(-45, 700, 230)">latest-21</text>
        <!-- PR Commit text -->
        <text x="850" y="125" class="pr-text" id="bp-cp-text"> BP of CP of</text>
        <text x="855" y="145" class="pr-text" id="bp-cp-text2">  &lt;abcdefg&gt; </text>
    </svg>`;

  // GSAP Animation
  const bpTimeline = gsap.timeline({
    repeat: -1,
    repeatDelay: 1,
    defaults: {
      duration: 1
    }
  });

  // Step 1: Show PR BP Commit text
  bpTimeline.from('#bp-text', {
    opacity: 0,
    duration: 1.5
  });

  // Step 2: Extend the release line
  bpTimeline.to('#release-line-bp', {
    duration: 1,
    attr: { x2: 350, y2: 100 }
  });

  // Step 3: Show new HEAD dot on the release branch
  bpTimeline
    .from('#release-new-head-bp', {
      duration: 1,
      opacity: 0
    }, '-=1')
    .to('#release-head-text-bp', {
      duration: 1,
      attr: { x: 278, y: 105 }
    }, '-=1');

  // Step 4: Show BP of CherryPick PR Commit text
  bpTimeline.from(['#bp-cp-text', '#bp-cp-text2'], {
    opacity: 0,
    duration: 1.5
  });

  // Step 5: Extend the latest line
  bpTimeline.to('#latest-line-bp', {
    duration: 1,
    attr: { x2: 850, y2: 100 }
  });

  // Step 6: Show new HEAD dot on the latest branch
  bpTimeline
    .from('#latest-new-head-bp', {
      duration: 1,
      opacity: 0
    }, '-=1')
    .to('#latest-head-text-bp', {
      duration: 1,
      attr: { x: 778, y: 105 }
    }, '-=1');
});

// Cut new release animation
waitForElement('#cut-new-release').then((e) => {
  e.innerHTML = `<svg viewBox="0 0 1000 300" class="animation" id="branch-cut">
        <!-- Main branch -->
        <line x1="300" y1="250" x2="500" y2="50" class="line" id="main-line-cut"></line>
        <circle cx="500" cy="50" r="8" class="circle" fill="red" id="main-head-cut"></circle>
        <text x="428" y="55" class="text" id="main-head-text-cut">HEAD</text>
        <text x="300" y="230" class="text" transform="rotate(-45, 300, 230)">main</text>

        <!-- Upstream branch -->
        <line x1="500" y1="250" x2="700" y2="50" class="line" id="upstream-line-cut"></line>
        <circle cx="700" cy="50" r="8" class="circle" fill="red" id="upstream-head-cut"></circle>
        <text x="710" y="55" class="text" id="upstream-head-text-cut">HEAD</text>
        <text x="500" y="230" class="text" transform="rotate(-45, 500, 230)">upstream</text>

        <!-- Dotted line -->
        <line x1="500" y1="50" x2="700" y2="50" class="dotted-line" id="dotted-line-cut"></line>

        <!-- Release-21.0 branch -->
        <line x1="200" y1="250" x2="350" y2="100" class="line" id="release-line-cut"></line>
        <circle cx="350" cy="100" r="8" class="circle" fill="red" id="release-head-cut"></circle>
        <text x="278" y="105" class="text" id="release-head-text-cut">HEAD</text>
        <text x="200" y="230" transform="rotate(-45, 200, 230)" id="release-head-label-cut">release-21</text>

        <!-- Latest-21.0 branch -->
        <line x1="700" y1="250" x2="850" y2="100" class="line" id="latest-line-cut"></line>
        <circle cx="850" cy="100" r="8" class="circle" fill="red" id="latest-head-cut"></circle>
        <text x="778" y="105" class="text" id="latest-head-text-cut">HEAD</text>
        <text x="700" y="230" transform="rotate(-45, 700, 230)" id="latest-head-label-cut">latest-21</text>
    </svg>`;

  // GSAP Animation
  const cutTimeline = gsap.timeline({
    repeat: -1,
    repeatDelay: 1,
    defaults: {
      duration: 1
    }
  });

  // Step 1: Cut the release-21 line
  cutTimeline.from('#release-line-cut', {
    duration: 1.5,
    attr: { x1: 300, y1: 250, x2: 500, y2: 50 }
  });

  // Step 2: Show release-21 text.
  cutTimeline
    .from('#release-head-text-cut', { opacity: 0 })
    .from('#release-head-cut', { opacity: 0 }, '-=1')
    .from('#release-head-label-cut', { opacity: 0 }, '-=1');

  // Step 3: Cut the latest-21 line
  cutTimeline.from('#latest-line-cut', {
    duration: 1.5,
    attr: { x1: 500, y1: 250, x2: 700, y2: 50 }
  });

  // Step 4: Show latest-21 text.
  cutTimeline
    .from('#latest-head-text-cut', { opacity: 0 })
    .from('#latest-head-cut', { opacity: 0 }, '-=1')
    .from('#latest-head-label-cut', { opacity: 0 }, '-=1');
});