<?php
    if (isset($_POST['submit'])) {
        $name = $_POST['name'];
        $mail_from = $_POST['email'];
        $message = $_POST['message'];

        $mail_to = "JustinEdwardsCS@gmail.com";
        $subject = "Portfolio Site Inquiry";
        $headers = "From: ".$mail_from;
        $txt = "Received Email From: ".$name.".\n\n".$message;

        mail($mailTo, $subject, $txt, $headers);
        header("Location: index.html?mailsend");

    }
?>
