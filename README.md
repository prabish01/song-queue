# Sidechanyn-MSQ-test
Build a simplified music player queue system in React + TypeScript.

To complete this test, please "use this template" and create the repo in your own account, then once compplete, send over your repo to us to assess. 

## 📋 Overview

Your task is to build a simplified music player queue system in React + TypeScript.
The player is not expected to actually play music, but it should manage a song queue, displaying the song information along with logic around genres, history, and queue maintenance.

This project is designed to test your ability to:
	•	Work with React state and components
	•	Write clean, maintainable TypeScript code
	•	Implement business logic (queue, filters, history)
	•	Pay attention to details in requirements

## 📝 Requirements

1. Queue Management
	•	The queue must always have at least 10 songs.
	•	When a song is played or removed, the queue should automatically refill from the available dataset.

3. Genres & Filtering
	•	Users can select zero or more genres.
	•	If no genres selected → queue fills with random songs.
	•	If one or more genres selected → queue should only include songs of those genres.
	•	Changing genres should rebuild the queue, except:
		•	The currently playing song should remain, even if it no longer matches the filter.

4. Playback Simulation
	•	There should always be a current song playing.
	•	Users should be able to move:
		•	Next → advances to the next song in the queue.
		•	Back → moves to a history buffer of up to 3 previously played songs.
	•	Songs in history should not appear in the queue unless the user goes back to them.

5. Queue Manipulation
	•	Users should be able to remove any song from the queue at any position.
	•	After removal, the queue should refill to maintain the 10-song minimum.

6. Song Data (use the songs.json file as a mock api request)

Each song should have at least:
	•	id (string/number)
	•	title (string)
	•	artist (string)
	•	album (string)
	•	genre (e.g., Rock, Pop, Jazz, Classical, Electronic, etc.)
	•	coverImage (static file or placeholder URL)

use the mock dataset provided in songs.json as if it was a API response

## ⚡ Bonus Features (Optional)

If you have extra time, consider:
	•	Smooth animations when songs enter/leave the queue.
	•	Ability to skip directly to a future song in the queue.
	•	Persist queue and history in localStorage.
	•	Shuffle logic for random mode.
	•	Unit tests for queue and filter logic.

## 📦 Deliverables
	•	A working React + TypeScript app (hosted or runnable locally).
	•	Clear README with:
	•	How to install and run
	•	Any assumptions made
	•	Bonus features implemented

## ⏱️ Time Expectation

We expect this project to take around 2–4 hours. Please don’t over-engineer — focus on delivering clean, working code that matches the requirements.

## ✅ What We’re Looking For
	•	Clean, readable, well-structured TypeScript
 	•	Well-structured and resuable components
	•	Correct handling of queue + history logic
	•	Attention to requirements & edge cases
	•	Basic but usable UI - Try to make it looks "good" in your own eyes - design is not a required skill here but its always nice to see someone with a keen eye for details/design
