<?php

$channel = filter_input(INPUT_GET, 'channel', FILTER_VALIDATE_REGEXP, array("options" => array("regexp" => "/^[a-zA-Z0-9_]{4,25}$/u")));

if ($channel) {
    $url = sprintf('https://api.twitch.tv/api/channels/%s/access_token/', $channel);
    $content = file_get_contents($url);
    $data = json_decode($content, true);

    $token = $data['token'];
    $sig = $data['sig'];

    if ($token && $sig) {
        $url = 'http://usher.twitch.tv/api/channel/hls/' . $channel . '.m3u8?player=twitchweb&token=' . rawurlencode($token) . '&sig=' . $sig;
        $output = ['url' => $url];

        $file = getFile($url);
        $fileContent = parseContent($file);

        $output['file'] = $fileContent;

        header("Content-Type: application/json");

        echo json_encode($output);
    } else {
        header("Content-Type: application/json");

        echo json_encode($data);
    }
} else {
    header("Content-Type: application/json");

    echo json_encode(array('message' => 'Invalid channel name!'));
}

function parseContent($content) {
    $lines = explode("\n", $content);

    if (count($lines) < 2) {
        return false;
    }
    if ($lines[0] !== '#EXTM3U') {
        return false;
    }

    unset($lines[0]);
    unset($lines[1]);

    $trimmedLines = array_map('trim', $lines);
    $filteredLines = array_filter($trimmedLines);
    $groupedLines = array_chunk($filteredLines, 3);

    $output = [];

    $index = 0;

    foreach ($groupedLines as $piece) {
        $piece[0] = explode(",", $piece[0]);

        foreach ($piece[0] as $media) {
            $mediaData = explode("=", $media);
            $output[$index]['media'][$mediaData[0]] = $mediaData[1];
        }

        $piece[1] = explode(",", $piece[1]);

        foreach ($piece[1] as $stream) {
            $streamData = explode("=", $stream);
            $output[$index]['stream'][$streamData[0]] = $streamData[1];
        }

        $output[$index]['url'] = $piece[2];

        $index++;
    }

    return $output;
}

function getFile($url) {
    $ch = curl_init();
    $timeout = 5;

    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, $timeout);

    $data = curl_exec($ch);
    curl_close($ch);

    return $data;
}
