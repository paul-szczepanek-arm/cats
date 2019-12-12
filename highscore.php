<!doctype html>

<head>
  <meta charset="utf-8">
  <title>You got a High Score</title>
  <style>
    table,
    th,
    td {
      border: 0px solid black;
    }

    tr:nth-child(even) {
      background-color: #bfa3a5;
    }

    .topimg {
      height: 110px;
      background-image: url("data/rank1.png");
    }

    .bottomimg {
      height: 110px;
      background-image: url("data/rank2.png");
    }

    body {
      background-color: #c5a8aa;
      font-family: Arial, Helvetica, sans-serif;
    }

    input[type="text"] {
      background-color: #c5a8aa;
      padding: 10px 20px;
      line-height: 38px;
      font-size: 38px;
      font-family: Arial, Helvetica, sans-serif;
      color: #946366;
    }
  </style>
</head>

<body>
  <table style="width:100%;">
    <tr style="background-color: #c5a8aa;">
      <td class="topimg" style="padding:0%;">
      </td>
    </tr>
    <?php
  $new_game = False;
  $scores = file_get_contents("scores.txt");

  $lines = explode(PHP_EOL, $scores);

  if (isset($_POST['form_submitted'])):
    $name = $_POST['score_name'];

    $name = trim($name);

    if(isset($name) === true && $name === ''):
      $name = "Anonymous kitten";
    endif;

    $name = preg_replace('/\s+/', ' ', $name);
    $message = $_POST['score_message'];
    $message = preg_replace('/\s+/', ' ', trim($message));

    $scores = "";
    $new_entry = array($_POST['score'], $name, $message);

    //find dupe
    $dupe = False;
    for ($i = 0; $i < count($lines); $i+=3) {
      if($lines[$i] == $_POST['score']):
        if($lines[$i+1] === $name):
          if($lines[$i+2] === $message):
            $dupe = True;
          endif;
        endif;
      endif;
    }

    // insert new item
    if($dupe == False):
      $pos = 0;

      for ($i = 0; $i < count($lines); $i+=3) {
        if($lines[$i] >= $_POST['score']):
          $pos = $i+3;
        endif;
      }

      array_splice($lines, $pos, 0, $new_entry);

      for ($i = 0; $i < count($lines); $i++) {
        $scores .= $lines[$i];
        $scores .= "\n";
      }

      $scores = trim($scores);

      $fh = fopen("scores.txt",'w');
      $written = fwrite($fh, $scores, 10000);
      fclose($fh);
    endif;
  ?>
    <tr style="background-color: #c5a8aa;">
      <td style="padding:0%;">
        <h2 style="text-align: center; font-size: 60px; color: #946366;">Score submitted.</h2>
      </td>
    </tr>
    <?php
      $new_game = True;
      
  else:

      if (isset($_POST['score'])):
  ?>
    <tr style="background-color: #c5a8aa;">
      <td style="padding-left:10%;padding-right:10%;">
        <h1 style="text-align: center; font-size: 60px; color: #946366; text-shadow: 3px 2px #665b6a">CONGRATULATIONS!</h1>


        <table style="width:100%; font-size: 48px; background-color: #d0c0c1; border: 7px solid #916566; border-radius: 35px;">
          <tr>
            <th>

              <h1 style="text-align: center; font-size: 48px; color: #946366;">YOUR SCORE: <?php echo $_POST['score']; ?></h2>

                <h1 style="text-align: center; line-height:40px ;font-size: 30px; color: #665b6a;">
                  <form action="highscore.php" method="POST">
                    Name: <br>
                    <input type="text" name="score_name" style="width:50%;" autofocus> <br>
                    <br>Optional message: <br>
                    <input type="text" name="score_message" style="width:90%;" height=200px> <br>

                    <input type="hidden" name="form_submitted" value="1" />
                    <input type="hidden" name="score" value="<?php echo $_POST['score']; ?>" />
                    <br>
                    <input style="font-size:40px; color: white; height:70px; width:400px; border: 7px solid #956468; background-color: #a97076; border-radius: 35px;" type="submit" value="SUBMIT">
                </h1>

            </th>
          </tr>
        </table>
        </form>
      </td>
    </tr>

    <?php
      else:
        $new_game = True;
      endif;
    endif;
  ?>

    <tr style="background-color: #c5a8aa; font-weight: bold;">
      <td style="padding-left:5%;padding-right:5%;">
        <h1 style="text-align: center; font-size: 60px; color: #946366; text-shadow: 3px 2px #665b6a">HIGH SCORES</h1>
        <table style="width:100%; font-size: 48px;">
          <?php
    for ($i = 0; $i < count($lines); $i+=3) {
    ?>
          <tr>
            <td width="40px" ; style="color: #946366; padding:30px; font-size: 40px; text-shadow: 3px 2px #665b6a">
              <?php
        echo($i / 3 + 1);
        ?>
            </td>
            <td width="200px" ; style="color: #946366; padding:20px; font-size: 45px; text-align: right">

              <?php
    echo($lines[$i]);
    ?>
            </td>
            <td width="30%" ; style="color: #946366; padding:20px; font-size: 45px;">

              <?php
    echo($lines[$i+1]);
    ?>
            </td>
            <td width="70%" ; style="color: #665b6a; font-size: 40px;">

              <?php
    echo($lines[$i+2]);
    ?>
            </td>
          </tr>
          <?php
    }
    ?>
        </table>
        <br><br>

        <?php
          if($new_game == True):
        ?>
        <center>
        <button style="font-size:40px; color: white; height:70px; width:400px; border: 7px solid #956468; background-color: #a97076; border-radius: 35px;" onclick="window.location.href = 'index.html';">NEW GAME</button>
        </center>
        <?php
          endif;
        ?>

        <br><br>
      </td>

    </tr>
    <tr style="background-color: #c5a8aa;">
      <td class="bottomimg">
      </td>
    </tr>
  </table>

</body>