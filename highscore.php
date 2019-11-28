<!doctype html>
<meta charset="utf-8">
<title>You got a High Score</title>

<body>
  <?php if (isset($_POST['score'])): ?>

  <h1>Contragulations!</h1>
  <h2>You got a high score of <?php echo $_POST['score']; ?>, please leave youre name.</h2>

  <form action="highscore.php" method="POST"> Name that will be displayed on the leaderboard: <br>

    <input type="text" name="highscorename"> <br><br>

    <input type="hidden" name="form_submitted" value="1" />
    <input type="hidden" name="highscore" value="<?php echo $_POST['score']; ?>" />

    <input type="submit" value="Submit">

  </form>

  <?php endif; ?>

  <?php if (isset($_POST['form_submitted'])): ?>
  <h2>Thanks for submitting your score <?php echo $_POST['highscorename']; ?> </h2>
  <?php endif; ?>

  <h1>Current leaderboard</h1>

</body>
